import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const merchantId = formData.get("merchant_id") as string;
  const orderId = formData.get("order_id") as string;
  const amount = formData.get("amount") as string;
  const statusCode = parseInt(formData.get("status_code") as string);
  const md5sig = formData.get("md5sig") as string;

  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "";
  const localHash = merchantId + orderId + amount + merchantSecret;
  const localMd5sig = require("crypto")
    .createHash("md5")
    .update(localHash)
    .digest("hex")
    .toUpperCase();

  if (localMd5sig !== md5sig) {
    return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
  }

  const paymentStatus = statusCode === 2 ? "Completed" : "Failed";

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus },
  });

  return NextResponse.json({ message: "OK" });
}
