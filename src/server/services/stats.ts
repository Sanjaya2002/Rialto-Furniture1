import "server-only";
import { db } from "../db";

export async function getDashboardStats() {
  const [
    totalOrders,
    totalProducts,
    totalCategories,
    totalQuotations,
    pendingQuotations,
    revenue,
    recentQuotations,
  ] = await Promise.all([
    db.order.count(),
    db.product.count(),
    db.category.count(),
    db.quotationRequest.count(),
    db.quotationRequest.count({ where: { status: "Pending" } }),
    db.order.aggregate({ where: { status: "Completed" }, _sum: { totalAmount: true } }),
    db.quotationRequest.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reference: true,
        customerName: true,
        status: true,
        createdAt: true,
        items: { select: { quantity: true, priceSnapshot: true } },
      },
    }),
  ]);

  return {
    totalOrders,
    totalProducts,
    totalCategories,
    totalQuotations,
    pendingQuotations,
    totalRevenue: revenue._sum.totalAmount ?? 0,
    recentQuotations: recentQuotations.map(({ items, ...q }) => ({
      ...q,
      total: items.reduce((sum, i) => sum + i.quantity * i.priceSnapshot, 0),
    })),
  };
}
