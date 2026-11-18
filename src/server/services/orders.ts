import "server-only";
import { db } from "../db";
import { notFound } from "../http";

/**
 * Orders are read-only history from the former online-payment flow.
 * New requests go through quotations; admins can still review these records.
 */
const withItems = { items: { include: { product: true } } } as const;

export function listOrders(status?: string) {
  return db.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: withItems,
  });
}

export async function getOrder(id: string) {
  const order = await db.order.findUnique({ where: { id }, include: withItems });
  if (!order) throw notFound("Order");
  return order;
}

export async function updateOrderStatus(id: string, status: string) {
  await getOrder(id);
  return db.order.update({ where: { id }, data: { status } });
}

export async function deleteOrder(id: string) {
  await getOrder(id);
  await db.$transaction([
    db.orderItem.deleteMany({ where: { orderId: id } }),
    db.order.delete({ where: { id } }),
  ]);
}
