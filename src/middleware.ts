import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Keeps the admin Supabase session cookie fresh. Storefront pages don't use
 * cookie sessions (checkout sign-in lives in the browser client), so the
 * matcher is limited to admin pages and API routes.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let response = NextResponse.next({ request });

  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
          }),
        );
      },
    },
  });

  try {
    await supabase.auth.getUser();
  } catch {
    // Network hiccup: let the request through; route guards still apply.
  }

  return response;
}

export const config = {
  runtime: "nodejs",
  matcher: ["/admin/:path*", "/api/:path*"],
};
