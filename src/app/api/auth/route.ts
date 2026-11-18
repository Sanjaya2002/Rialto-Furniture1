import { NextResponse } from "next/server";
import { handler, HttpError, parseJson } from "@/server/http";
import { isAdminUser } from "@/server/auth";
import { createServerSupabaseClient } from "@/server/supabase";
import { loginInput } from "@/server/validation";

/** Admin sign-in (email + password). Sets the session cookie. */
export const POST = handler(async (request) => {
  const { email, password } = await parseJson(request, loginInput);
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new HttpError(401, "Invalid email or password.");

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    throw new HttpError(403, "This account does not have admin access.");
  }

  return NextResponse.json({ user: { id: data.user.id, email: data.user.email } });
});
