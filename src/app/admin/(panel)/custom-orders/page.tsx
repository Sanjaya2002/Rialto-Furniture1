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
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Eye, ExternalLink } from "lucide-react";

interface CustomOrderRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  furnitureType: string;
  description: string;
  dimensions: string | null;
  attachment: string | null;
  attachmentUrl: string | null;
  status: string;
  createdAt: string;
}

const STATUSES = ["Pending", "In Review", "Approved", "Rejected"] as const;

export default function AdminCustomOrdersPage() {
  const [requests, setRequests] = useState<CustomOrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingRequest, setViewingRequest] = useState<CustomOrderRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const fetchRequests = useCallback(async () => {
    const res = await fetch("/api/custom-orders");
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not load data");
      return;
    }
    setRequests(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    fetchRequests().finally(() => setLoading(false));
  }, [fetchRequests]);

  async function handleStatusChange(id: string, status: string) {
    try {
      const res = await fetch(`/api/custom-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Status updated");
      fetchRequests();
    } catch {
      toast.error("Failed to update status");
    }
  }

  const statusColors: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-900 border-amber-200",
    "In Review": "bg-sky-100 text-sky-900 border-sky-200",
    Approved: "bg-emerald-100 text-emerald-900 border-emerald-200",
    Rejected: "bg-rose-100 text-rose-900 border-rose-200",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Custom Orders</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage custom furniture requests</p>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-ink-muted">Name</TableHead>
              <TableHead className="text-ink-muted">Email</TableHead>
              <TableHead className="text-ink-muted">Furniture Type</TableHead>
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
                      <Skeleton className="h-4 w-28 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-36 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16 bg-bone" />
                    </TableCell>
                  </TableRow>
                ))
              : requests.map((req) => (
                  <TableRow key={req.id} className="border-border text-ink">
                    <TableCell className="font-medium">{req.customerName}</TableCell>
                    <TableCell className="text-ink-muted">{req.email}</TableCell>
                    <TableCell className="text-ink-muted">{req.furnitureType}</TableCell>
                    <TableCell>
                      <Select value={req.status} onValueChange={(v) => handleStatusChange(req.id, v)}>
                        <SelectTrigger
                          className={`h-7 w-fit gap-1 border-0 px-2 text-xs font-semibold ${statusColors[
                            req.status
                          ]
                            ?.split(" ")
                            .slice(0, 3)
                            .join(" ")}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-card text-ink">
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-ink-muted">{formatDate(new Date(req.createdAt))}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setViewingRequest(req);
                          setViewDialogOpen(true);
                        }}
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
            <DialogTitle className="text-ink">Custom Order Details</DialogTitle>
            <DialogDescription className="text-ink-muted">
              Submitted on {viewingRequest ? formatDate(new Date(viewingRequest.createdAt)) : ""}
            </DialogDescription>
          </DialogHeader>
          {viewingRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-ink-muted">Name</p>
                  <p className="text-sm text-ink">{viewingRequest.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Email</p>
                  <p className="text-sm text-ink">{viewingRequest.email}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Phone</p>
                  <p className="text-sm text-ink">{viewingRequest.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Furniture Type</p>
                  <p className="text-sm text-ink">{viewingRequest.furnitureType}</p>
                </div>
              </div>
              <Separator className="bg-border" />
              <div>
                <p className="text-xs text-ink-muted">Description</p>
                <p className="mt-1 text-sm text-ink">{viewingRequest.description}</p>
              </div>
              {viewingRequest.dimensions && (
                <div>
                  <p className="text-xs text-ink-muted">Dimensions</p>
                  <p className="mt-1 text-sm text-ink">{viewingRequest.dimensions}</p>
                </div>
              )}
              {viewingRequest.attachmentUrl && (
                <div>
                  <p className="text-xs text-ink-muted">Attachment</p>
                  <a
                    href={viewingRequest.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm text-accent-deep hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Attachment
                  </a>
                </div>
              )}
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted">Status</span>
                <Badge
                  variant="outline"
                  className={statusColors[viewingRequest.status] || "border-border text-ink-muted"}
                >
                  {viewingRequest.status}
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
