import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { sendOrderConfirmation } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth) return auth;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const itemsData = body.items as { productId: string; quantity: number }[];

    const productIds = itemsData.map((i) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((p) => p.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));
      return NextResponse.json(
        {
          error: `Some products in your cart no longer exist. Please remove them and try again.`,
          missingIds,
        },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p.price]));
    const productNameMap = new Map(products.map((p) => [p.id, p.name]));

    let totalAmount = 0;
    const orderItems = itemsData.map((item) => {
      const price = productMap.get(item.productId) || 0;
      totalAmount += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
      };
    });

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        address: body.address,
        paymentMethod: body.paymentMethod,
        totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    sendOrderConfirmation({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      address: order.address,
      paymentMethod: order.paymentMethod || "cod",
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        name: productNameMap.get(item.productId) || "Product",
        quantity: item.quantity,
        price: item.price,
      })),
    }).catch((err) => console.error("Failed to send confirmation email:", err));

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
