import { NextResponse } from "next/server";
import { handler, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { deleteOrder, getOrder, updateOrderStatus } from "@/server/services/orders";
import { orderStatusInput } from "@/server/validation";

type Params = { id: string };

export const GET = handler<Params>(async (_request, { params }) => {
  await requireAdmin();
  return NextResponse.json(await getOrder((await params).id));
});

export const PATCH = handler<Params>(async (request, { params }) => {
  await requireAdmin();
  const { status } = await parseJson(request, orderStatusInput);
  return NextResponse.json(await updateOrderStatus((await params).id, status));
});

export const DELETE = handler<Params>(async (_request, { params }) => {
  await requireAdmin();
  await deleteOrder((await params).id);
  return NextResponse.json({ message: "Order deleted" });
});
