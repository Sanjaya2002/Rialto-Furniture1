import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

function checkRateLimit(key: string): boolean {
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

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string; adminSecretKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.toString().trim() ?? "";
  const password = body.password ?? "";
  const adminSecretKey = body.adminSecretKey ?? "";

  if (!email || !password || !adminSecretKey) {
    return NextResponse.json(
      { error: "Email, password, and admin secret key are required" },
      { status: 400 }
    );
  }

  const expectedKey = process.env.ADMIN_SECRET_KEY;
  if (!expectedKey || !safeEqual(adminSecretKey, expectedKey)) {
    return NextResponse.json(
      { error: "Invalid admin secret key" },
      { status: 403 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(`ip:${ip}`) || !checkRateLimit(`email:${email}`)) {
    return NextResponse.json(
      { error: "Too many signup attempts. Try again later." },
      { status: 429 }
    );
  }

  const adminClient = getSupabaseAdminClient();
  const { data: created, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError) {
    const status = createError.message.toLowerCase().includes("already")
      ? 409
      : 400;
    return NextResponse.json({ error: createError.message }, { status });
  }

  if (!created.user) {
    return NextResponse.json(
      { error: "Something went wrong while creating the account." },
      { status: 500 }
    );
  }

  const supabase = await createServerSupabaseClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return NextResponse.json(
      { error: "Account created, but automatic sign-in failed. Please log in." },
      { status: 200 }
    );
  }

  return NextResponse.json({ success: true, user: created.user });
}