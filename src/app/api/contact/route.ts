import { NextResponse } from "next/server";
import { handler, parseJson } from "@/server/http";
import { contactInput } from "@/server/validation";

/**
 * Contact messages are validated and logged (visible in hosting logs).
 * There is no contact table in the schema; hook an email provider here if needed.
 */
export const POST = handler(async (request) => {
  const message = await parseJson(request, contactInput);
  console.info("[contact] New message", { ...message, receivedAt: new Date().toISOString() });
  return NextResponse.json({ message: "Thank you for your message. We will get back to you soon." });
});
