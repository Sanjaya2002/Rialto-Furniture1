import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { handler, HttpError, parseJson } from "@/server/http";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/server/supabase";
import { signupInput } from "@/server/validation";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

/** Best-effort per-instance limiter; the secret key is the real gate. */
function withinRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= RATE_LIMIT_MAX;
}

function safeEqual(a: string, b: string): boolean {
  const aHash = createHash("sha256").update(a).digest();
  const bHash = createHash("sha256").update(b).digest();
  return timingSafeEqual(aHash, bHash);
}

/** Creates an admin account. Requires ADMIN_SECRET_KEY. */
export const POST = handler(async (request) => {
  const { email, password, adminSecretKey } = await parseJson(request, signupInput);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!withinRateLimit(`ip:${ip}`) || !withinRateLimit(`email:${email}`)) {
    throw new HttpError(429, "Too many signup attempts. Try again later.");
  }

  const expectedKey = process.env.ADMIN_SECRET_KEY;
  if (!expectedKey || !safeEqual(adminSecretKey, expectedKey)) {
    throw new HttpError(403, "Invalid admin secret key.");
  }

  const { data, error } = await createAdminSupabaseClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" },
  });
  if (error) {
    throw new HttpError(error.message.toLowerCase().includes("already") ? 409 : 400, error.message);
  }
  if (!data.user) throw new HttpError(500, "Something went wrong while creating the account.");

  const supabase = await createServerSupabaseClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  return NextResponse.json({ success: true, signedIn: !signInError });
});
