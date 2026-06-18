import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { order_id, status, transaction_id } = body;

  const paymentStatus = status === "success" ? "Completed" : "Failed";

  await prisma.order.update({
    where: { id: order_id },
    data: { paymentStatus },
  });

  console.log("KOKO payment notification:", {
    order_id,
    status,
    transaction_id,
  });

  return NextResponse.json({ message: "OK" });
}
