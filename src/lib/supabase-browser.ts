"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./supabase-env";

let client: SupabaseClient | null = null;

/** Browser Supabase client (customer Google sign-in at checkout). */
export function getBrowserSupabase(): SupabaseClient {
  if (!client) {
    const { url, anonKey } = getSupabaseEnv();
    client = createClient(url, anonKey);
  }
  return client;
}
