import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "../db";
import { HttpError, notFound } from "../http";
import { generateSlug } from "@/lib/utils";
import type { ProductInput, ProductUpdate } from "../validation";

export type ProductSort = "newest" | "price-asc" | "price-desc";

export interface ProductQuery {
  search?: string;
  category?: string;
  featured?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

const withCategory = { category: true } satisfies Prisma.ProductInclude;
export type ProductWithCategory = Prisma.ProductGetPayload<{ include: typeof withCategory }>;

const ORDER_BY: Record<ProductSort, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
};

export function parseSort(value: string | null | undefined): ProductSort {
  return value === "price-asc" || value === "price-desc" ? value : "newest";
}

export async function listProducts(query: ProductQuery = {}) {
  const page = Math.max(1, Math.floor(query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Math.floor(query.limit ?? 12)));

  const where: Prisma.ProductWhereInput = {};
  if (query.search) where.name = { contains: query.search, mode: "insensitive" };
  if (query.category) where.OR = [{ categoryId: query.category }, { category: { slug: query.category } }];
  if (query.featured) where.featured = true;

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: ORDER_BY[query.sort ?? "newest"],
      skip: (page - 1) * limit,
      take: limit,
      include: withCategory,
    }),
    db.product.count({ where }),
  ]);

  return { products, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export function getProductBySlug(slug: string) {
  return db.product.findUnique({ where: { slug }, include: withCategory });
}

/** Featured products, topped up with the newest pieces when fewer are flagged. */
export async function getFeaturedProducts(take = 6): Promise<ProductWithCategory[]> {
  const featured = await db.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take,
    include: withCategory,
  });
  if (featured.length >= take) return featured;

  const extra = await db.product.findMany({
    where: { id: { notIn: featured.map((p) => p.id) } },
    orderBy: { createdAt: "desc" },
    take: take - featured.length,
    include: withCategory,
  });
  return [...featured, ...extra];
}

export function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  return db.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    orderBy: { createdAt: "desc" },
    take,
    include: withCategory,
  });
}

export function listProductSitemapEntries() {
  return db.product.findMany({ select: { slug: true, updatedAt: true } });
}

function toJson(value: ProductInput["specifications"]) {
  if (value === undefined) return undefined;
  return value === null ? Prisma.DbNull : (value as Prisma.InputJsonObject);
}

export function createProduct(input: ProductInput) {
  return db.product.create({
    data: { ...input, slug: generateSlug(input.name), specifications: toJson(input.specifications) },
  });
}

export async function updateProduct(slug: string, input: ProductUpdate) {
  const existing = await db.product.findUnique({ where: { slug }, select: { id: true } });
  if (!existing) throw notFound("Product");

  return db.product.update({
    where: { slug },
    data: {
      ...input,
      ...(input.name ? { slug: generateSlug(input.name) } : {}),
      specifications: toJson(input.specifications),
    },
  });
}

export async function deleteProduct(slug: string) {
  const existing = await db.product.findUnique({
    where: { slug },
    select: { id: true, _count: { select: { quotationItems: true, orderItems: true } } },
  });
  if (!existing) throw notFound("Product");
  if (existing._count.quotationItems > 0 || existing._count.orderItems > 0) {
    throw new HttpError(
      409,
      "This product appears in quotation requests, so it can't be deleted (that would break those records). Set its stock to 0 or rename it instead.",
    );
  }
  await db.$transaction([
    db.review.deleteMany({ where: { productId: existing.id } }),
    db.product.delete({ where: { id: existing.id } }),
  ]);
}
