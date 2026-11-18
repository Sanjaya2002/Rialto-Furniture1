import { NextResponse } from "next/server";
import { handler, HttpError } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { uploadImage } from "@/server/services/uploads";

/** Admin image upload (multipart: "file", optional "folder"). Returns { url }. */
export const POST = handler(async (request) => {
  await requireAdmin();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new HttpError(400, "Invalid upload.");
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) throw new HttpError(400, "Choose an image to upload.");
  const folder = typeof form.get("folder") === "string" ? String(form.get("folder")) : "products";

  return NextResponse.json({ url: await uploadImage(file, folder) }, { status: 201 });
});
