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
import { formatDate } from "@/lib/utils"
import { adminFetch } from "@/lib/admin-fetch"
import { toast } from "sonner"
import { Eye, ExternalLink } from "lucide-react"

interface CustomOrderRequest {
  id: string
  customerName: string
  email: string
  phone: string
  furnitureType: string
  description: string
  dimensions: string | null
  attachment: string | null
  status: string
  createdAt: string
}

const STATUSES = ["Pending", "In Review", "Approved", "Rejected"] as const

export default function AdminCustomOrdersPage() {
  const [requests, setRequests] = useState<CustomOrderRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingRequest, setViewingRequest] = useState<CustomOrderRequest | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const fetchRequests = useCallback(async () => {
    const res = await adminFetch("/api/custom-orders")
    const data = await res.json()
    setRequests(data)
  }, [])

  useEffect(() => {
    fetchRequests().finally(() => setLoading(false))
  }, [fetchRequests])

  async function handleStatusChange(id: string, status: string) {
    try {
      const res = await adminFetch(`/api/custom-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      toast.success("Status updated")
      fetchRequests()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "In Review": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Approved: "bg-green-500/20 text-green-400 border-green-500/30",
    Rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Custom Orders</h1>
        <p className="mt-1 text-sm text-gray-400">Manage custom furniture requests</p>
      </div>

      <div className="rounded-lg border border-border bg-[#1A1A1A]">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Furniture Type</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell><Skeleton className="h-4 w-28 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-36 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 bg-white/5" /></TableCell>
                  </TableRow>
                ))
              : requests.map((req) => (
                  <TableRow key={req.id} className="border-border text-white">
                    <TableCell className="font-medium">{req.customerName}</TableCell>
                    <TableCell className="text-gray-400">{req.email}</TableCell>
                    <TableCell className="text-gray-400">{req.furnitureType}</TableCell>
                    <TableCell>
                      <Select
                        value={req.status}
                        onValueChange={(v) => handleStatusChange(req.id, v)}
                      >
                        <SelectTrigger
                          className={`h-7 w-fit gap-1 border-0 px-2 text-xs font-semibold ${
                            statusColors[req.status]?.split(" ").slice(0, 3).join(" ")
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-[#1A1A1A] text-white">
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {formatDate(new Date(req.createdAt))}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setViewingRequest(req)
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
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-[#1A1A1A]">
          <DialogHeader>
            <DialogTitle className="text-white">Custom Order Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Submitted on {viewingRequest ? formatDate(new Date(viewingRequest.createdAt)) : ""}
            </DialogDescription>
          </DialogHeader>
          {viewingRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm text-white">{viewingRequest.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-white">{viewingRequest.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-white">{viewingRequest.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Furniture Type</p>
                  <p className="text-sm text-white">{viewingRequest.furnitureType}</p>
                </div>
              </div>
              <Separator className="bg-border" />
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="mt-1 text-sm text-white">{viewingRequest.description}</p>
              </div>
              {viewingRequest.dimensions && (
                <div>
                  <p className="text-xs text-gray-500">Dimensions</p>
                  <p className="mt-1 text-sm text-white">{viewingRequest.dimensions}</p>
                </div>
              )}
              {viewingRequest.attachment && (
                <div>
                  <p className="text-xs text-gray-500">Attachment</p>
                  <a
                    href={viewingRequest.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm text-gold hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Attachment
                  </a>
                </div>
              )}
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <Badge
                  variant="outline"
                  className={statusColors[viewingRequest.status] || "border-border text-gray-400"}
                >
                  {viewingRequest.status}
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
