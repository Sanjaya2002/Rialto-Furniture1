import "server-only";
import { z } from "zod";
import { CUSTOM_ORDER_STATUSES, ORDER_STATUSES, QUOTATION_STATUSES } from "@/lib/constants";

const requiredText = (label: string, max = 200) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`);

const optionalText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const email = z.string().trim().email("Please enter a valid email address.");
const phone = z
  .string()
  .trim()
  .regex(/^[+\d][\d\s-]{6,15}$/, "Please enter a valid phone number.");

/* ---------- Catalogue (admin) ---------- */

export const productInput = z.object({
  name: requiredText("Name"),
  description: requiredText("Description", 5000),
  price: z.coerce.number().nonnegative("Price must be zero or more."),
  categoryId: requiredText("Category"),
  stock: z.coerce.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  images: z.array(z.string().trim().url("Each image must be a valid URL.")).default([]),
  specifications: z.record(z.string(), z.unknown()).nullable().optional(),
});
export const productUpdate = productInput.partial();
export type ProductInput = z.infer<typeof productInput>;
export type ProductUpdate = z.infer<typeof productUpdate>;

export const categoryInput = z.object({
  name: requiredText("Name", 100),
  slug: optionalText(120),
  description: optionalText(1000),
  image: z.string().trim().url("Image must be a valid URL.").optional(),
});
export const categoryUpdate = categoryInput.partial();
export type CategoryInput = z.infer<typeof categoryInput>;
export type CategoryUpdate = z.infer<typeof categoryUpdate>;

/* ---------- Public submissions ---------- */

export const reviewInput = z.object({
  productId: requiredText("Product"),
  name: requiredText("Name", 80),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: requiredText("Comment", 2000),
});
export type ReviewInput = z.infer<typeof reviewInput>;

export const contactInput = z.object({
  name: requiredText("Name", 100),
  email,
  phone: z.string().trim().max(30).optional(),
  message: requiredText("Message", 5000),
});

export const customOrderInput = z.object({
  customerName: requiredText("Full name", 100),
  email,
  phone,
  furnitureType: requiredText("Furniture type", 60),
  description: requiredText("Description", 5000),
  dimensions: optionalText(200),
});
export type CustomOrderInput = z.infer<typeof customOrderInput>;

export const quotationInput = z.object({
  customerName: requiredText("Full name", 100),
  customerEmail: email,
  customerPhone: phone,
  address: requiredText("Delivery address", 500),
  notes: optionalText(2000),
  idempotencyKey: z.string().trim().max(100).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1, "One or more cart items are invalid."),
        quantity: z.coerce
          .number()
          .int("One or more cart items are invalid.")
          .min(1, "One or more cart items are invalid.")
          .max(1000, "Quantity exceeds the maximum allowed."),
      }),
    )
    .min(1, "Your cart is empty."),
});
export type QuotationInput = z.infer<typeof quotationInput>;

/* ---------- Status updates (admin) ---------- */

export const orderStatusInput = z.object({ status: z.enum(ORDER_STATUSES) });
export const quotationStatusInput = z.object({ status: z.enum(QUOTATION_STATUSES) });
export const customOrderStatusInput = z.object({ status: z.enum(CUSTOM_ORDER_STATUSES) });

/* ---------- Auth ---------- */

export const loginInput = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});

export const signupInput = z.object({
  email,
  password: z.string().min(8, "Password must be at least 8 characters."),
  adminSecretKey: z.string().min(1, "Admin secret key is required."),
});
