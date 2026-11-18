import { NextResponse } from "next/server";
import { handler, parseJson } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { rateLimit } from "@/server/rate-limit";
import { createContactMessage, listContactMessages } from "@/server/services/contact-messages";
import { contactInput } from "@/server/validation";

/** Admin: all contact-form messages, newest first. */
export const GET = handler(async () => {
  await requireAdmin();
  return NextResponse.json(await listContactMessages());
});

/** Public: stores a contact-form message (shown in Admin → Messages). */
export const POST = handler(async (request) => {
  rateLimit(request, "contact", 5, 60 * 60 * 1000);
  const input = await parseJson(request, contactInput);
  await createContactMessage(input);
  return NextResponse.json(
    { message: "Thank you for your message. We will get back to you soon." },
    { status: 201 },
  );
});
