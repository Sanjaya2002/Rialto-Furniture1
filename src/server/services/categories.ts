import "server-only";
import { db } from "../db";
import { HttpError, notFound } from "../http";
import { generateSlug } from "@/lib/utils";
import type { CategoryInput, CategoryUpdate } from "../validation";

export function listCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export type CategoryWithCount = Awaited<ReturnType<typeof listCategories>>[number];

export function createCategory(input: CategoryInput) {
  return db.category.create({
    data: { ...input, slug: input.slug ? generateSlug(input.slug) : generateSlug(input.name) },
  });
}

export async function updateCategory(id: string, input: CategoryUpdate) {
  const existing = await db.category.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw notFound("Category");
  return db.category.update({
    where: { id },
    data: { ...input, ...(input.slug ? { slug: generateSlug(input.slug) } : {}) },
  });
}

export async function deleteCategory(id: string) {
  const existing = await db.category.findUnique({
    where: { id },
    select: { id: true, _count: { select: { products: true } } },
  });
  if (!existing) throw notFound("Category");
  if (existing._count.products > 0) {
    throw new HttpError(409, "This category still has products. Move or delete them first.");
  }
  await db.category.delete({ where: { id } });
}
