import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const slug = body.slug || generateSlug(body.name);

  const category = await prisma.category.create({
    data: { ...body, slug },
  });

  return NextResponse.json(category, { status: 201 });
}
