import { NextResponse } from "next/server";
import { handler } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { listQuotations } from "@/server/services/quotations";

export const GET = handler(async (request) => {
  await requireAdmin();
  const status = request.nextUrl.searchParams.get("status") || undefined;
  return NextResponse.json(await listQuotations(status));
});
