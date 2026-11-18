import "server-only";
import { randomUUID } from "node:crypto";
import { db } from "../db";
import { HttpError, notFound } from "../http";
import { createAdminSupabaseClient } from "../supabase";
import type { CustomOrderInput } from "../validation";

/** Supabase Storage bucket for customer reference images / sketches. */
const ATTACHMENT_BUCKET = process.env.SUPABASE_ATTACHMENTS_BUCKET || "custom-order-attachments";
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"]);

export function validateAttachment(file: File) {
  if (file.size > MAX_ATTACHMENT_BYTES) throw new HttpError(400, "Attachment must be 5 MB or smaller.");
  if (!ALLOWED_TYPES.has(file.type)) throw new HttpError(400, "Attachment must be an image or a PDF.");
}

let bucketReady = false;

/** Creates the private attachments bucket on first use. */
async function ensureAttachmentBucket() {
  if (bucketReady) return;
  const storage = createAdminSupabaseClient().storage;
  const { data } = await storage.getBucket(ATTACHMENT_BUCKET);
  if (!data) {
    const { error } = await storage.createBucket(ATTACHMENT_BUCKET, {
      public: false,
      fileSizeLimit: MAX_ATTACHMENT_BYTES,
    });
    if (error && !/already exists/i.test(error.message)) throw error;
  }
  bucketReady = true;
}

/**
 * Uploads to Supabase Storage. Returns the stored path, or null when storage
 * is unavailable — the request itself is still saved so no lead is lost.
 */
async function uploadAttachment(file: File): Promise<string | null> {
  try {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "") || "bin";
    const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
    await ensureAttachmentBucket();
    const { error } = await createAdminSupabaseClient()
      .storage.from(ATTACHMENT_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    return `${ATTACHMENT_BUCKET}/${path}`;
  } catch (error) {
    console.error("[custom-orders] Attachment upload failed; saving request without it.", error);
    return null;
  }
}

export async function createCustomOrder(input: CustomOrderInput, file?: File | null) {
  const attachment = file && file.size > 0 ? await uploadAttachment(file) : null;
  return db.customOrderRequest.create({
    data: { ...input, dimensions: input.dimensions ?? null, attachment },
  });
}

/** Short-lived signed URL so admins can open a stored attachment. */
export async function getAttachmentUrl(stored: string | null): Promise<string | null> {
  if (!stored) return null;
  if (/^https?:\/\//.test(stored)) return stored;
  const [bucket, ...rest] = stored.split("/");
  try {
    const { data } = await createAdminSupabaseClient()
      .storage.from(bucket)
      .createSignedUrl(rest.join("/"), 60 * 60);
    return data?.signedUrl ?? null;
  } catch {
    return null;
  }
}

export async function listCustomOrders() {
  const requests = await db.customOrderRequest.findMany({ orderBy: { createdAt: "desc" } });
  return Promise.all(
    requests.map(async (r) => ({ ...r, attachmentUrl: await getAttachmentUrl(r.attachment) })),
  );
}

async function ensureExists(id: string) {
  const existing = await db.customOrderRequest.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw notFound("Request");
}

export async function updateCustomOrderStatus(id: string, status: string) {
  await ensureExists(id);
  return db.customOrderRequest.update({ where: { id }, data: { status } });
}

export async function deleteCustomOrder(id: string) {
  await ensureExists(id);
  await db.customOrderRequest.delete({ where: { id } });
}
