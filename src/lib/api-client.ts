/** fetch() wrapper for admin screens: parses JSON and throws the server's error message on failure. */
export async function apiRequest<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error("Your session has expired. Please sign in again.");
    throw new Error((data as { error?: string }).error || `Request failed (${res.status}).`);
  }
  return data as T;
}

export const jsonBody = (body: unknown, method = "POST"): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const errorMessage = (error: unknown, fallback = "Something went wrong.") =>
  error instanceof Error ? error.message : fallback;
