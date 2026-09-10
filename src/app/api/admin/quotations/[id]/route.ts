import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (auth) return auth;

    const { id } = await params;
    const quotation = await prisma.quotationRequest.findUnique({
      where: { id },
      include: {
        items: true,
        user: { select: { name: true, email: true, image: true } },
      },
    });

    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    return NextResponse.json(quotation);
  } catch (error) {
    console.error("Failed to fetch quotation:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotation" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (auth) return auth;

    const { id } = await params;
    const existing = await prisma.quotationRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    const body = await request.json();

    if (!body.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updated = await prisma.quotationRequest.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update quotation:", error);
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (auth) return auth;

    const { id } = await params;
    const existing = await prisma.quotationRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    await prisma.quotationRequest.delete({ where: { id } });

    return NextResponse.json({ message: "Quotation deleted successfully" });
  } catch (error) {
    console.error("Failed to delete quotation:", error);
    return NextResponse.json(
      { error: "Failed to delete quotation" },
      { status: 500 }
    );
  }
}