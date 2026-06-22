"use client"

import { getSupabaseClient } from "./supabase";

async function getAccessToken(): Promise<string | null> {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
}
