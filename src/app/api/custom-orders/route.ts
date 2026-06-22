import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth) return auth;

  const requests = await prisma.customOrderRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}

export async function POST(request: NextRequest) {
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
}
