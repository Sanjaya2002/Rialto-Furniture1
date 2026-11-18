import { NextResponse } from "next/server";
import { handler } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { listOrders } from "@/server/services/orders";

export const GET = handler(async (request) => {
  await requireAdmin();
  const status = request.nextUrl.searchParams.get("status") || undefined;
  return NextResponse.json(await listOrders(status));
});
