import { NextResponse } from "next/server";
import { handler } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { getDashboardStats } from "@/server/services/stats";

export const GET = handler(async () => {
  await requireAdmin();
  return NextResponse.json(await getDashboardStats());
});
