import { NextResponse } from "next/server";
import { revalidateStorefront } from "@/server/revalidate";
import { handler, HttpError, parseJson } from "@/server/http";
import { getAdminUser } from "@/server/auth";
import { createReview, listAllReviews, listProductReviews } from "@/server/services/reviews";
import { reviewInput } from "@/server/validation";

/**
 * Public: ?productId=… returns that product's reviews.
 * Admin: full moderation list (optionally filtered by productId).
 */
export const GET = handler(async (request) => {
  const productId = request.nextUrl.searchParams.get("productId") || undefined;

  if (await getAdminUser()) return NextResponse.json(await listAllReviews(productId));
  if (!productId) throw new HttpError(401, "Unauthorized");
  return NextResponse.json(await listProductReviews(productId));
});

export const POST = handler(async (request) => {
  const input = await parseJson(request, reviewInput);
  const review = await createReview(input);
  revalidateStorefront();
  return NextResponse.json(review, { status: 201 });
});
