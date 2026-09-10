import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth) return auth;

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");

    const quotations = await prisma.quotationRequest.findMany({
      where: status ? { status } : undefined,
      include: {
        items: true,
        user: { select: { name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(quotations);
  } catch (error) {
    console.error("Failed to fetch quotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}