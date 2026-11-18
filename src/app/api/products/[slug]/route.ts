import { NextResponse } from "next/server";
import { revalidateStorefront } from "@/server/revalidate";
import { handler, notFound, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { deleteProduct, getProductBySlug, updateProduct } from "@/server/services/products";
import { productUpdate } from "@/server/validation";

type Params = { slug: string };

export const GET = handler<Params>(async (_request, { params }) => {
  const product = await getProductBySlug((await params).slug);
  if (!product) throw notFound("Product");
  return NextResponse.json(product);
});

export const PUT = handler<Params>(async (request, { params }) => {
  await requireAdmin();
  const input = await parseJson(request, productUpdate);
  const product = await updateProduct((await params).slug, input);
  revalidateStorefront();
  return NextResponse.json(product);
});

export const DELETE = handler<Params>(async (_request, { params }) => {
  await requireAdmin();
  await deleteProduct((await params).slug);
  revalidateStorefront();
  return NextResponse.json({ message: "Product deleted" });
});
