import "server-only";
import { randomInt, randomUUID } from "node:crypto";
import { after } from "next/server";
import type { User } from "@supabase/supabase-js";
import { db } from "../db";
import { HttpError, notFound } from "../http";
import { sendQuotationNotification } from "../notifications/whatsapp";
import type { QuotationInput } from "../validation";

const REFERENCE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateReference(): string {
  let ref = "";
  for (let i = 0; i < 6; i++) ref += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  return `RQ-${ref}`;
}

async function uniqueReference(): Promise<string> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const reference = generateReference();
    const clash = await db.quotationRequest.findUnique({ where: { reference }, select: { id: true } });
    if (!clash) return reference;
  }
  throw new HttpError(500, "Could not allocate a quotation reference. Please try again.");
}

/** Merges duplicate lines and caps quantity per product. */
function normaliseItems(items: QuotationInput["items"]): Map<string, number> {
  const merged = new Map<string, number>();
  for (const { productId, quantity } of items) {
    merged.set(productId, Math.min((merged.get(productId) ?? 0) + quantity, 1000));
  }
  return merged;
}

async function upsertCustomer(user: User & { email: string }) {
  const meta = user.user_metadata ?? {};
  const name = typeof meta.full_name === "string" ? meta.full_name : user.email;
  const image = typeof meta.avatar_url === "string" ? meta.avatar_url : null;

  const existing = await db.user.findFirst({
    where: { OR: [{ id: user.id }, { email: user.email }] },
    select: { id: true },
  });
  if (existing) return db.user.update({ where: { id: existing.id }, data: { name, image } });
  return db.user.create({ data: { id: user.id, email: user.email, name, image } });
}

/**
 * Creates a quotation request. `user` is the signed-in Google customer, or null for a guest
 * (contact details then come only from the form).
 */
export async function createQuotation(
  user: User | null,
  input: QuotationInput,
  headerIdempotencyKey?: string | null,
): Promise<{ reference: string; alreadySubmitted: boolean }> {
  const idempotencyKey = input.idempotencyKey || headerIdempotencyKey || randomUUID();

  const existing = await db.quotationRequest.findUnique({
    where: { idempotencyKey },
    select: { reference: true },
  });
  if (existing) return { reference: existing.reference, alreadySubmitted: true };

  const items = normaliseItems(input.items);
  const productIds = Array.from(items.keys());
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true },
  });
  if (products.length !== productIds.length) {
    throw new HttpError(400, "One or more products are no longer available.");
  }
  const productById = new Map(products.map((p) => [p.id, p]));

  const customer = user?.email ? await upsertCustomer(user as User & { email: string }) : null;
  const reference = await uniqueReference();

  const quotation = await db.quotationRequest.create({
    data: {
      reference,
      idempotencyKey,
      userId: customer?.id ?? null,
      status: "Pending",
      notes: input.notes ?? null,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      address: input.address,
      items: {
        create: Array.from(items.entries()).map(([productId, quantity]) => {
          const product = productById.get(productId)!;
          return {
            productId,
            productNameSnapshot: product.name,
            quantity,
            priceSnapshot: product.price,
          };
        }),
      },
    },
    include: { items: true },
  });

  // Runs after the response is sent (and is kept alive on serverless hosts).
  // The quotation is saved even if the notification fails.
  after(() =>
    sendQuotationNotification({
      reference: quotation.reference,
      customerName: quotation.customerName,
      customerPhone: quotation.customerPhone,
      totalItems: quotation.items.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: quotation.items.reduce((sum, i) => sum + i.priceSnapshot * i.quantity, 0),
    }),
  );

  return { reference: quotation.reference, alreadySubmitted: false };
}

const adminInclude = {
  items: true,
  user: { select: { name: true, email: true, image: true } },
} as const;

export function listQuotations(status?: string) {
  return db.quotationRequest.findMany({
    where: status ? { status } : undefined,
    include: adminInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getQuotation(id: string) {
  const quotation = await db.quotationRequest.findUnique({ where: { id }, include: adminInclude });
  if (!quotation) throw notFound("Quotation");
  return quotation;
}

export async function updateQuotationStatus(id: string, status: string) {
  await getQuotation(id);
  return db.quotationRequest.update({ where: { id }, data: { status } });
}

export async function deleteQuotation(id: string) {
  await getQuotation(id);
  await db.quotationRequest.delete({ where: { id } });
}
