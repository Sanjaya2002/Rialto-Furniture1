import { NextResponse } from "next/server";
import { handler, HttpError } from "@/server/http";
import { createServerSupabaseClient } from "@/server/supabase";

export const POST = handler(async () => {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new HttpError(500, error.message);
  return NextResponse.json({ success: true });
});
