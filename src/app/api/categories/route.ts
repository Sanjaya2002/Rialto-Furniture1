import { NextResponse } from "next/server";
import { revalidateStorefront } from "@/server/revalidate";
import { handler, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { createCategory, listCategories } from "@/server/services/categories";
import { categoryInput } from "@/server/validation";

export const GET = handler(async () => NextResponse.json(await listCategories()));

export const POST = handler(async (request) => {
  await requireAdmin();
  const input = await parseJson(request, categoryInput);
  const category = await createCategory(input);
  revalidateStorefront();
  return NextResponse.json(category, { status: 201 });
});
