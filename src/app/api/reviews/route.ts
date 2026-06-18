import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  const where = productId ? { productId } : {};

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
  });

  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.rating < 1 || body.rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  const review = await prisma.review.create({
    data: {
      productId: body.productId,
      name: body.name,
      rating: body.rating,
      comment: body.comment,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
