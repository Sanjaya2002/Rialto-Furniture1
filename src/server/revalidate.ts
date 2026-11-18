import "server-only";
import { revalidatePath } from "next/cache";

/** Catalogue changed: refresh every cached storefront page (home, shop, products, footer). */
export function revalidateStorefront() {
  revalidatePath("/", "layout");
}
