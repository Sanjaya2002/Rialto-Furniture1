import { NextResponse } from "next/server";
import { handler, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { deleteQuotation, getQuotation, updateQuotationStatus } from "@/server/services/quotations";
import { quotationStatusInput } from "@/server/validation";

type Params = { id: string };

export const GET = handler<Params>(async (_request, { params }) => {
  await requireAdmin();
  return NextResponse.json(await getQuotation((await params).id));
});

export const PATCH = handler<Params>(async (request, { params }) => {
  await requireAdmin();
  const { status } = await parseJson(request, quotationStatusInput);
  return NextResponse.json(await updateQuotationStatus((await params).id, status));
});

export const DELETE = handler<Params>(async (_request, { params }) => {
  await requireAdmin();
  await deleteQuotation((await params).id);
  return NextResponse.json({ message: "Quotation deleted" });
});
