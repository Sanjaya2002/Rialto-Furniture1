import { NextResponse } from "next/server";
import { handler, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { deleteCustomOrder, updateCustomOrderStatus } from "@/server/services/custom-orders";
import { customOrderStatusInput } from "@/server/validation";

type Params = { id: string };

export const PATCH = handler<Params>(async (request, { params }) => {
  await requireAdmin();
  const { status } = await parseJson(request, customOrderStatusInput);
  return NextResponse.json(await updateCustomOrderStatus((await params).id, status));
});

export const DELETE = handler<Params>(async (_request, { params }) => {
  await requireAdmin();
  await deleteCustomOrder((await params).id);
  return NextResponse.json({ message: "Request deleted" });
});
