import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./supabase";

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function createServerSupabaseClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...options,
              ...SESSION_COOKIE_OPTIONS,
            })
          );
        } catch {
          // Called from a Server Component during render when the session is
          // being refreshed; cookies can only be set in a route handler,
          // server action, or middleware. Safe to ignore.
        }
      },
    },
  });
}

export function createServerSupabaseClientForRequest(request: Request) {
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("cookie") ?? "");
      },
      setAll() {
        // Read-only guard context: token refresh is handled by middleware,
        // which rewrites the cookie before it reaches this route.
      },
    },
  });
}

function parseCookieHeader(header: string): { name: string; value: string }[] {
  if (!header) return [];

  return header.split(";").reduce<{ name: string; value: string }[]>(
    (acc, part) => {
      const eq = part.indexOf("=");
      if (eq === -1) return acc;
      const name = part.slice(0, eq).trim();
      const value = part.slice(eq + 1).trim();
      if (name) acc.push({ name, value });
      return acc;
    },
    []
  );
}