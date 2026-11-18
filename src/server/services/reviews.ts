import "server-only";
import { db } from "../db";
import { notFound } from "../http";
import type { ReviewInput } from "../validation";

const publicFields = { id: true, name: true, rating: true, comment: true, createdAt: true } as const;

export function listProductReviews(productId: string) {
  return db.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    select: publicFields,
  });
}

export type PublicReview = Awaited<ReturnType<typeof listProductReviews>>[number];

/** Well-rated recent reviews for the homepage. */
export function listTestimonials(take = 6) {
  return db.review.findMany({
    where: { rating: { gte: 4 } },
    orderBy: { createdAt: "desc" },
    take,
    select: { ...publicFields, product: { select: { name: true, slug: true } } },
  });
}

export function listAllReviews(productId?: string) {
  return db.review.findMany({
    where: productId ? { productId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
  });
}

export async function createReview(input: ReviewInput) {
  const product = await db.product.findUnique({ where: { id: input.productId }, select: { id: true } });
  if (!product) throw notFound("Product");
  return db.review.create({ data: input, select: publicFields });
}

export async function deleteReview(id: string) {
  const existing = await db.review.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw notFound("Review");
  await db.review.delete({ where: { id } });
}
