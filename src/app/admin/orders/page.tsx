"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { Eye, Loader2 } from "lucide-react"
import { ORDER_STATUSES } from "@/lib/constants"

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: { name: string }
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  totalAmount: number
  status: string
  paymentMethod: string | null
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/orders")
    const data = await res.json()
    setOrders(data)
  }, [])

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false))
  }, [fetchOrders])

  async function handleStatusChange(orderId: string, status: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      toast.success("Order status updated")
      fetchOrders()
    } catch {
      toast.error("Failed to update order status")
    }
  }

  function openViewDialog(order: Order) {
    setViewingOrder(order)
    setViewDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Orders</h1>
        <p className="mt-1 text-sm text-gray-400">View and manage customer orders</p>
      </div>

      <div className="rounded-lg border border-border bg-[#1A1A1A]">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-gray-400">Order ID</TableHead>
              <TableHead className="text-gray-400">Customer</TableHead>
              <TableHead className="text-gray-400">Total</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell><Skeleton className="h-4 w-20 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 bg-white/5" /></TableCell>
                  </TableRow>
                ))
              : orders.map((order) => (
                  <TableRow key={order.id} className="border-border text-white">
                    <TableCell className="font-mono text-xs text-gray-400">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell className="text-gold">{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleStatusChange(order.id, v)}
                      >
                        <SelectTrigger
                          className={`h-7 w-fit gap-1 border-0 px-2 text-xs font-semibold ${
                            order.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : order.status === "Processing"
                                ? "bg-blue-500/20 text-blue-400"
                                : order.status === "Completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-[#1A1A1A] text-white">
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {formatDate(new Date(order.createdAt))}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewDialog(order)}
                        className="text-gray-400 hover:text-white"
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
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-[#1A1A1A]">
          <DialogHeader>
            <DialogTitle className="text-white">Order Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Order #{viewingOrder?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="text-sm text-white">{viewingOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-white">{viewingOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-white">{viewingOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment</p>
                  <p className="text-sm text-white">{viewingOrder.paymentMethod || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Shipping Address</p>
                <p className="text-sm text-white">{viewingOrder.address}</p>
              </div>
              <Separator className="bg-border" />
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">Items</p>
                {viewingOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-1 text-sm"
                  >
                    <span className="text-white">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="text-gold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">Total</span>
                <span className="text-lg font-bold text-gold">
                  {formatPrice(viewingOrder.totalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <Badge
                  variant="outline"
                  className={
                    viewingOrder.status === "Pending"
                      ? "border-yellow-500/30 text-yellow-400"
                      : viewingOrder.status === "Processing"
                        ? "border-blue-500/30 text-blue-400"
                        : viewingOrder.status === "Completed"
                          ? "border-green-500/30 text-green-400"
                          : "border-red-500/30 text-red-400"
                  }
                >
                  {viewingOrder.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
              className="border-border text-gray-300 hover:text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
