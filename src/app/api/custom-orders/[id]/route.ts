import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (auth) return auth;

    const { id } = await params;
    const existing = await prisma.customOrderRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const body = await request.json();

    const updated = await prisma.customOrderRequest.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update custom order:", error);
    return NextResponse.json(
      { error: "Failed to update custom order" },
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
    const existing = await prisma.customOrderRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    await prisma.customOrderRequest.delete({ where: { id } });

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Failed to delete custom order:", error);
    return NextResponse.json(
      { error: "Failed to delete custom order" },
      { status: 500 }
    );
  }
}
