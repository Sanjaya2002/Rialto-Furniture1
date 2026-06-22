import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, adminSecretKey } = body;

  if (!email || !password || !adminSecretKey) {
    return NextResponse.json(
      { error: "Email, password, and admin secret key are required" },
      { status: 400 }
    );
  }

  const expectedKey = process.env.ADMIN_SECRET_KEY;
  if (!expectedKey || adminSecretKey !== expectedKey) {
    return NextResponse.json(
      { error: "Invalid admin secret key" },
      { status: 403 }
    );
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ session: data.session, user: data.user });
}
