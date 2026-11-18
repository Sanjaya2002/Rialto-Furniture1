"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { ORDER_STATUSES } from "@/lib/constants";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  totalAmount: number;
  status: string;
  paymentMethod: string | null;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not load data");
      return;
    }
    setOrders(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false));
  }, [fetchOrders]);

  async function handleStatusChange(orderId: string, status: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update order status");
    }
  }

  function openViewDialog(order: Order) {
    setViewingOrder(order);
    setViewDialogOpen(true);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Orders</h1>
        <p className="mt-1 text-sm text-ink-muted">View and manage customer orders</p>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-ink-muted">Order ID</TableHead>
              <TableHead className="text-ink-muted">Customer</TableHead>
              <TableHead className="text-ink-muted">Total</TableHead>
              <TableHead className="text-ink-muted">Status</TableHead>
              <TableHead className="text-ink-muted">Date</TableHead>
              <TableHead className="text-ink-muted">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell>
                      <Skeleton className="h-4 w-20 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16 bg-bone" />
                    </TableCell>
                  </TableRow>
                ))
              : orders.map((order) => (
                  <TableRow key={order.id} className="border-border text-ink">
                    <TableCell className="font-mono text-xs text-ink-muted">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell className="text-accent-deep">{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                        <SelectTrigger
                          className={`h-7 w-fit gap-1 border-0 px-2 text-xs font-semibold ${
                            order.status === "Pending"
                              ? "bg-amber-100 text-amber-900"
                              : order.status === "Processing"
                                ? "bg-sky-100 text-sky-900"
                                : order.status === "Completed"
                                  ? "bg-emerald-100 text-emerald-900"
                                  : "bg-rose-100 text-rose-900"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-card text-ink">
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-ink-muted">{formatDate(new Date(order.createdAt))}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewDialog(order)}
                        className="text-ink-muted hover:text-ink"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-ink">Order Details</DialogTitle>
            <DialogDescription className="text-ink-muted">
              Order #{viewingOrder?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-ink-muted">Customer</p>
                  <p className="text-sm text-ink">{viewingOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Email</p>
                  <p className="text-sm text-ink">{viewingOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Phone</p>
                  <p className="text-sm text-ink">{viewingOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Payment</p>
                  <p className="text-sm text-ink">{viewingOrder.paymentMethod || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Shipping Address</p>
                <p className="text-sm text-ink">{viewingOrder.address}</p>
              </div>
              <Separator className="bg-border" />
              <div>
                <p className="mb-2 text-xs font-medium text-ink-muted">Items</p>
                {viewingOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1 text-sm">
                    <span className="text-ink">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="text-accent-deep">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">Total</span>
                <span className="text-lg font-bold text-accent-deep">
                  {formatPrice(viewingOrder.totalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted">Status</span>
                <Badge
                  variant="outline"
                  className={
                    viewingOrder.status === "Pending"
                      ? "border-amber-200 text-amber-900"
                      : viewingOrder.status === "Processing"
                        ? "border-sky-200 text-sky-900"
                        : viewingOrder.status === "Completed"
                          ? "border-emerald-200 text-emerald-900"
                          : "border-rose-200 text-rose-900"
                  }
                >
                  {viewingOrder.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
