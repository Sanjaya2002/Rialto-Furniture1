import { NextResponse } from "next/server";
import { revalidateStorefront } from "@/server/revalidate";
import { handler, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { createProduct, listProducts, parseSort } from "@/server/services/products";
import { productInput } from "@/server/validation";

export const GET = handler(async (request) => {
  const params = request.nextUrl.searchParams;
  const result = await listProducts({
    search: params.get("search") || undefined,
    category: params.get("category") || undefined,
    featured: params.get("featured") === "true",
    sort: parseSort(params.get("sort")),
    page: Number(params.get("page")) || 1,
    limit: Number(params.get("limit")) || 12,
  });
  return NextResponse.json(result);
});

export const POST = handler(async (request) => {
  await requireAdmin();
  const input = await parseJson(request, productInput);
  const product = await createProduct(input);
  revalidateStorefront();
  return NextResponse.json(product, { status: 201 });
});
