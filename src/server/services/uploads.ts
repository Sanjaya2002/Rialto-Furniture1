import "server-only";
import { randomUUID } from "node:crypto";
import { HttpError } from "../http";
import { createAdminSupabaseClient } from "../supabase";

/** Public Supabase Storage bucket for catalogue photos (created on first upload). */
const IMAGES_BUCKET = process.env.SUPABASE_IMAGES_BUCKET || "product-images";
const MAX_BYTES = 4 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB; the admin UI compresses first.
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const FOLDERS = new Set(["products", "categories", "projects"]);

let bucketReady = false;

async function ensureBucket() {
  if (bucketReady) return;
  const storage = createAdminSupabaseClient().storage;
  const { data } = await storage.getBucket(IMAGES_BUCKET);
  if (!data) {
    const { error } = await storage.createBucket(IMAGES_BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: Object.keys(TYPES),
    });
    if (error && !/already exists/i.test(error.message)) {
      throw new HttpError(500, `Could not create the "${IMAGES_BUCKET}" storage bucket: ${error.message}`);
    }
  }
  bucketReady = true;
}

export function validateImage(file: File) {
  if (!TYPES[file.type]) throw new HttpError(400, "Upload a JPG, PNG, WebP or AVIF image.");
  if (file.size > MAX_BYTES) throw new HttpError(413, "Image must be 4 MB or smaller.");
}

/** Uploads an image and returns its public URL. */
export async function uploadImage(file: File, folder = "products"): Promise<string> {
  validateImage(file);
  await ensureBucket();

  const safeFolder = FOLDERS.has(folder) ? folder : "products";
  const path = `${safeFolder}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${TYPES[file.type]}`;
  const storage = createAdminSupabaseClient().storage.from(IMAGES_BUCKET);

  const { error } = await storage.upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new HttpError(500, `Upload failed: ${error.message}`);

  return storage.getPublicUrl(path).data.publicUrl;
}
