import { NextResponse } from "next/server";
import { handler, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { deleteContactMessage, updateContactMessageStatus } from "@/server/services/contact-messages";
import { contactStatusInput } from "@/server/validation";

type Params = { id: string };

export const PATCH = handler<Params>(async (request, { params }) => {
  await requireAdmin();
  const { status } = await parseJson(request, contactStatusInput);
  return NextResponse.json(await updateContactMessageStatus((await params).id, status));
});

export const DELETE = handler<Params>(async (_request, { params }) => {
  await requireAdmin();
  await deleteContactMessage((await params).id);
  return NextResponse.json({ message: "Message deleted" });
});
