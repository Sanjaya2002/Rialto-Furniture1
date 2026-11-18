import "server-only";
import type { User } from "@supabase/supabase-js";
import { createAnonSupabaseClient, createServerSupabaseClient } from "./supabase";
import { HttpError } from "./http";

/**
 * Admins carry app_metadata.role = "admin", which only the service role can set
 * (the protected /admin/signup does this). A signed-in session alone is never enough:
 * Supabase lets anyone with the public anon key create an email account.
 * Promote an existing account with `npm run admin:promote -- you@example.com`.
 */
export function isAdminUser(user: User | null | undefined): user is User {
  return user?.app_metadata?.role === "admin";
}

/** Current admin from the session cookie, or null. For Server Components. */
export async function getAdminUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return isAdminUser(user) ? user : null;
  } catch {
    return null;
  }
}

/** Throws 401 unless the request carries an admin session. */
export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser();
  if (!user) throw new HttpError(401, "Unauthorized");
  return user;
}

/** Customer identified by a Supabase access token in the Authorization header (optional sign-in). */
export async function getBearerUser(request: Request): Promise<User | null> {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const { data, error } = await createAnonSupabaseClient().auth.getUser(token);
    return error ? null : data.user;
  } catch {
    return null;
  }
}
