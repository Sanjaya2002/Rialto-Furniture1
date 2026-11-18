import { NextResponse } from "next/server";
import { handler, HttpError, parseJson } from "@/server/http";
import { getBearerUser } from "@/server/auth";
import { createQuotation } from "@/server/services/quotations";
import { quotationInput } from "@/server/validation";

export const POST = handler(async (request) => {
  const user = await getBearerUser(request);
  if (!user?.email) throw new HttpError(401, "You must be signed in to request a quotation.");

  const input = await parseJson(request, quotationInput);
  const result = await createQuotation(user, input, request.headers.get("Idempotency-Key"));

  return NextResponse.json({ success: true, ...result }, { status: result.alreadySubmitted ? 200 : 201 });
});
