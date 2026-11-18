import { NextResponse } from "next/server";
import { handler, HttpError, parseJson, validate } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { rateLimit } from "@/server/rate-limit";
import { createCustomOrder, listCustomOrders, validateAttachment } from "@/server/services/custom-orders";
import { customOrderInput } from "@/server/validation";

export const GET = handler(async () => {
  await requireAdmin();
  return NextResponse.json(await listCustomOrders());
});

/** Accepts multipart/form-data (with optional "file") or JSON. */
export const POST = handler(async (request) => {
  rateLimit(request, "custom-order", 6, 60 * 60 * 1000);
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      throw new HttpError(400, "Invalid form submission.");
    }
    const field = (key: string) => {
      const value = form.get(key);
      return typeof value === "string" ? value : undefined;
    };
    const input = validate(
      {
        customerName: field("customerName"),
        email: field("email"),
        phone: field("phone"),
        furnitureType: field("furnitureType"),
        description: field("description"),
        dimensions: field("dimensions"),
      },
      customOrderInput,
    );
    const file = form.get("file");
    const attachment = file instanceof File && file.size > 0 ? file : null;
    if (attachment) validateAttachment(attachment);

    const created = await createCustomOrder(input, attachment);
    return NextResponse.json({ id: created.id }, { status: 201 });
  }

  const input = await parseJson(request, customOrderInput);
  const created = await createCustomOrder(input);
  return NextResponse.json({ id: created.id }, { status: 201 });
});
