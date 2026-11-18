import { NextResponse } from "next/server";
import { handler, parseJson } from "@/server/http";
import { getBearerUser } from "@/server/auth";
import { rateLimit } from "@/server/rate-limit";
import { createQuotation } from "@/server/services/quotations";
import { quotationInput } from "@/server/validation";

/** Guests can request a quotation; a Google sign-in (Bearer token) is optional and links it to the account. */
export const POST = handler(async (request) => {
  rateLimit(request, "quotation", 8, 60 * 60 * 1000);
  const user = await getBearerUser(request);
  const input = await parseJson(request, quotationInput);
  const result = await createQuotation(user, input, request.headers.get("Idempotency-Key"));

  return NextResponse.json({ success: true, ...result }, { status: result.alreadySubmitted ? 200 : 201 });
});
