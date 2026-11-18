import { NextResponse } from "next/server";
import { revalidateStorefront } from "@/server/revalidate";
import { handler, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { deleteCategory, updateCategory } from "@/server/services/categories";
import { categoryUpdate } from "@/server/validation";

type Params = { id: string };

export const PUT = handler<Params>(async (request, { params }) => {
  await requireAdmin();
  const input = await parseJson(request, categoryUpdate);
  const category = await updateCategory((await params).id, input);
  revalidateStorefront();
  return NextResponse.json(category);
});

export const DELETE = handler<Params>(async (_request, { params }) => {
  await requireAdmin();
  await deleteCategory((await params).id);
  revalidateStorefront();
  return NextResponse.json({ message: "Category deleted" });
});
