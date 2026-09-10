import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { sendQuotationNotification } from "@/lib/whatsapp";

function generateReference(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let ref = "";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RQ-${ref}`;
}

function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

interface QuotationItemInput {
  productId: string;
  quantity: number;
}

const PHONE_REGEX = /^[+\d][\d\s-]{6,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const supabaseUser = await getCurrentUser(request);

  if (!supabaseUser || !supabaseUser.email) {
    return NextResponse.json({ error: "You must be signed in to request a quotation." }, { status: 401 });
  }

  let body: {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    address?: string;
    notes?: string;
    items?: QuotationItemInput[];
    idempotencyKey?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = body.items ?? [];
  const customerName = body.customerName?.trim() ?? "";
  const customerEmail = body.customerEmail?.trim() ?? "";
  const customerPhone = body.customerPhone?.trim() ?? "";
  const address = body.address?.trim() ?? "";
  const notes = body.notes?.trim() ?? "";
  const idempotencyKey =
    body.idempotencyKey?.trim() ||
    request.headers.get("Idempotency-Key") ||
    generateIdempotencyKey();

  if (!customerName) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!customerEmail || !EMAIL_REGEX.test(customerEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!customerPhone || !PHONE_REGEX.test(customerPhone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (!address) {
    return NextResponse.json({ error: "Please enter your delivery address." }, { status: 400 });
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const normalizedItems = new Map<string, number>();
  for (const item of items) {
    const productId = item.productId?.trim();
    const quantity = Math.floor(Number(item.quantity));
    if (!productId || !Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "One or more cart items are invalid." }, { status: 400 });
    }
    if (quantity > 1000) {
      return NextResponse.json({ error: "Quantity exceeds the maximum allowed." }, { status: 400 });
    }
    normalizedItems.set(productId, Math.min((normalizedItems.get(productId) ?? 0) + quantity, 1000));
  }

  const productIds = Array.from(normalizedItems.keys());
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "One or more products are no longer available." }, { status: 400 });
  }

  const productById = new Map(products.map((p) => [p.id, p]));

  const existing = await prisma.quotationRequest.findUnique({
    where: { idempotencyKey },
    select: { reference: true },
  });

  if (existing) {
    return NextResponse.json({ success: true, reference: existing.reference, alreadySubmitted: true });
  }

  let reference = generateReference();
  let attempts = 0;
  while (attempts < 5) {
    const clash = await prisma.quotationRequest.findUnique({
      where: { reference },
      select: { id: true },
    });
    if (!clash) break;
    reference = generateReference();
    attempts++;
  }

  try {
    const name =
      typeof supabaseUser.user_metadata?.full_name === "string"
        ? supabaseUser.user_metadata.full_name
        : supabaseUser.email;
    const image =
      typeof supabaseUser.user_metadata?.avatar_url === "string"
        ? supabaseUser.user_metadata.avatar_url
        : null;

    const customer = await prisma.user.upsert({
      where: { email: supabaseUser.email },
      update: { name, image },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name,
        image,
      },
    });

    const quotation = await prisma.$transaction(async (tx) => {
      const created = await tx.quotationRequest.create({
        data: {
          reference,
          idempotencyKey,
          userId: customer.id,
          status: "Pending",
          notes: notes || null,
          customerName,
          customerEmail,
          customerPhone,
          address,
          items: {
            create: Array.from(normalizedItems.entries()).map(([productId, quantity]) => {
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
      return created;
    });

    const totalAmount = quotation.items.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0
    );
    const totalItems = quotation.items.reduce((sum, item) => sum + item.quantity, 0);

    sendQuotationNotification({
      reference: quotation.reference,
      customerName: quotation.customerName,
      customerPhone: quotation.customerPhone,
      totalItems,
      totalAmount,
      itemsSummary: `Rialto Furniture quotation request ${quotation.reference}`,
    }).catch(() => {
      console.error(`[WhatsApp] async notification failed for quotation ${quotation.reference}`);
    });

    return NextResponse.json(
      { success: true, reference: quotation.reference, alreadySubmitted: false },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create quotation request:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Something went wrong while saving your quotation. Please try again." },
      { status: 500 }
    );
  }
}