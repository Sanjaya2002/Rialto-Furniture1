import { createClient } from "@supabase/supabase-js";

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not set. Add it to your .env file."
    );
  }
  if (!anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Add it to your .env file."
    );
  }

  return { url, anonKey };
}

function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your .env file."
    );
  }
  return key;
}

export function getSupabaseClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createClient(url, anonKey);
}

export function getSupabaseAdminClient() {
  return createClient(getSupabaseEnv().url, getSupabaseServiceRoleKey());
}