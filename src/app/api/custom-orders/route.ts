import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth) return auth;

    const requests = await prisma.customOrderRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Failed to fetch custom orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const customOrder = await prisma.customOrderRequest.create({
      data: {
        customerName: body.customerName,
        email: body.email,
        phone: body.phone,
        furnitureType: body.furnitureType,
        description: body.description,
        dimensions: body.dimensions,
        attachment: body.attachment,
      },
    });

    return NextResponse.json(customOrder, { status: 201 });
  } catch (error) {
    console.error("Failed to create custom order:", error);
    return NextResponse.json(
      { error: "Failed to create custom order" },
      { status: 500 }
    );
  }
}
