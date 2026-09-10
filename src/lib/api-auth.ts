import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabase";
import { createServerSupabaseClientForRequest } from "./supabase-server";

export async function getCurrentUser(request: Request): Promise<User | null> {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function requireAdmin(request: Request) {
  const supabase = createServerSupabaseClientForRequest(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}