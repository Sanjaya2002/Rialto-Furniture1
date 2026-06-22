import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth) return auth;
  const [totalOrders, totalProducts, totalCategories, orders, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.findMany({
        where: { status: "Completed" },
        select: { totalAmount: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          customerName: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  const totalRevenue = orders.reduce((sum: number, o: { totalAmount: number }) => sum + o.totalAmount, 0);

  return NextResponse.json({
    totalOrders,
    totalProducts,
    totalCategories,
    totalRevenue,
    recentOrders,
  });
}
