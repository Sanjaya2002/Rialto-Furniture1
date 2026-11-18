import "server-only";
import type { User } from "@supabase/supabase-js";
import { createAnonSupabaseClient, createServerSupabaseClient } from "./supabase";
import { HttpError } from "./http";

/**
 * Admins are Supabase users created through the protected admin signup
 * (email + password). Customers sign in with Google at checkout and must
 * never reach admin APIs, so a signed-in session alone is not enough.
 */
export function isAdminUser(user: User | null | undefined): user is User {
  if (!user) return false;
  const meta = user.app_metadata ?? {};
  if (meta.role === "admin") return true;
  const providers: unknown = meta.providers;
  return meta.provider === "email" && (!Array.isArray(providers) || providers.every((p) => p === "email"));
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

/** Customer identified by a Supabase access token in the Authorization header. */
export async function getBearerUser(request: Request): Promise<User | null> {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await createAnonSupabaseClient().auth.getUser(token);
  return error ? null : data.user;
}
