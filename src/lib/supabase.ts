import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL;
  if (!url) return "https://placeholder.supabase.co";
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.SUPABASE_ANON_KEY;
  if (!key) return "placeholder-key";
  return key;
}

export function getSupabaseClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
}

export function getSupabaseAdminClient() {
  return createClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
  );
}
