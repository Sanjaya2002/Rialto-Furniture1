import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

/** Products saved without a price (0) are quoted individually. */
export const hasPrice = (price: number) => price > 0;

/** Unit price for storefront display: "LKR 13,599" or "Price on request". */
export function formatProductPrice(price: number): string {
  return hasPrice(price) ? formatPrice(price) : "Price on request";
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "numeric" });

export function formatDate(date: Date | string): string {
  return dateFormatter.format(new Date(date));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Two-digit index label: 1 → "01". */
export const pad = (n: number) => String(n).padStart(2, "0");
