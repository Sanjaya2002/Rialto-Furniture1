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
import { formatDate, formatPrice } from "@/lib/utils"
import { QUOTATION_STATUSES } from "@/lib/constants"
import { adminFetch } from "@/lib/admin-fetch"
import { toast } from "sonner"
import { Eye } from "lucide-react"

interface QuotationItem {
  id: string
  productNameSnapshot: string
  quantity: number
  priceSnapshot: number
}

interface Quotation {
  id: string
  reference: string
  status: string
  notes: string | null
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string | null
  createdAt: string
  items: QuotationItem[]
  user: { name: string | null; email: string | null; image: string | null } | null
}

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Approved: "bg-green-500/20 text-green-400 border-green-500/30",
  Rejected: "bg-red-500/20 text-red-400 border-red-500/30",
}

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState<Quotation | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const fetchQuotations = useCallback(async () => {
    const res = await adminFetch("/api/admin/quotations")
    const data = await res.json()
    setQuotations(data)
  }, [])

  useEffect(() => {
    fetchQuotations().finally(() => setLoading(false))
  }, [fetchQuotations])

  async function handleStatusChange(id: string, status: string) {
    try {
      const res = await adminFetch(`/api/admin/quotations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      toast.success("Status updated")
      fetchQuotations()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const quotationTotal = (q: Quotation) =>
    q.items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Quotations</h1>
        <p className="mt-1 text-sm text-gray-400">Manage customer quotation requests</p>
      </div>

      <div className="rounded-lg border border-border bg-[#1E3D55]">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-gray-400">Reference</TableHead>
              <TableHead className="text-gray-400">Customer</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Items</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-28 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-36 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 bg-white/5" /></TableCell>
                  </TableRow>
                ))
              : quotations.map((q) => (
                  <TableRow key={q.id} className="border-border text-white">
                    <TableCell className="font-medium text-gold">{q.reference}</TableCell>
                    <TableCell className="font-medium">{q.customerName}</TableCell>
                    <TableCell className="text-gray-400">{q.customerEmail}</TableCell>
                    <TableCell className="text-gray-400">
                      {q.items.reduce((sum, i) => sum + i.quantity, 0)} items
                    </TableCell>
                    <TableCell>
                      <Select
                        value={q.status}
                        onValueChange={(v) => handleStatusChange(q.id, v)}
                      >
                        <SelectTrigger
                          className={`h-7 w-fit gap-1 border-0 px-2 text-xs font-semibold ${
                            statusColors[q.status]?.split(" ").slice(0, 3).join(" ")
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-[#1E3D55] text-white">
                          {QUOTATION_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {formatDate(new Date(q.createdAt))}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setViewing(q)
                          setViewDialogOpen(true)
                        }}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-[#1E3D55]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Quotation {viewing?.reference ?? ""}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Submitted on {viewing ? formatDate(new Date(viewing.createdAt)) : ""}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <Badge
                  variant="outline"
                  className={statusColors[viewing.status] || "border-border text-gray-400"}
                >
                  {viewing.status}
                </Badge>
              </div>
              <Separator className="bg-border" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Customer Name</p>
                  <p className="text-sm text-white">{viewing.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-white">{viewing.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-white">{viewing.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Signed-in as</p>
                  <p className="text-sm text-white">{viewing.user?.email || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="mt-1 text-sm text-white">{viewing.address || "—"}</p>
              </div>
              <Separator className="bg-border" />
              <div>
                <p className="mb-2 text-xs text-gray-500">Items</p>
                <div className="space-y-2">
                  {viewing.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-white/5 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {item.productNameSnapshot}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} × {formatPrice(item.priceSnapshot)}
                        </p>
                      </div>
                      <p className="ml-3 shrink-0 text-sm font-medium text-gold">
                        {formatPrice(item.priceSnapshot * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gold-light/5 px-3 py-2">
                <span className="text-sm font-medium text-white">Estimated Total</span>
                <span className="text-base font-bold text-gold">
                  {formatPrice(quotationTotal(viewing))}
                </span>
              </div>
              {viewing.notes && (
                <>
                  <Separator className="bg-border" />
                  <div>
                    <p className="text-xs text-gray-500">Notes</p>
                    <p className="mt-1 text-sm text-white">{viewing.notes}</p>
                  </div>
                </>
              )}
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