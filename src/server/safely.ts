import "server-only";

/**
 * For non-critical page data (footer categories, testimonials, rails):
 * log the failure and render a graceful fallback instead of a 500 page.
 */
export async function safely<T>(load: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await load();
  } catch (error) {
    console.error(`[data] ${label} failed:`, error instanceof Error ? error.message : error);
    return fallback;
  }
}
