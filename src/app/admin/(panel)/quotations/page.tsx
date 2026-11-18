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
import { formatDate, formatPrice } from "@/lib/utils";
import { QUOTATION_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import { Eye } from "lucide-react";

interface QuotationItem {
  id: string;
  productNameSnapshot: string;
  quantity: number;
  priceSnapshot: number;
}

interface Quotation {
  id: string;
  reference: string;
  status: string;
  notes: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string | null;
  createdAt: string;
  items: QuotationItem[];
  user: { name: string | null; email: string | null; image: string | null } | null;
}

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-900 border-amber-200",
  Processing: "bg-sky-100 text-sky-900 border-sky-200",
  Approved: "bg-emerald-100 text-emerald-900 border-emerald-200",
  Rejected: "bg-rose-100 text-rose-900 border-rose-200",
};

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Quotation | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const fetchQuotations = useCallback(async () => {
    const res = await fetch("/api/admin/quotations");
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not load data");
      return;
    }
    setQuotations(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    fetchQuotations().finally(() => setLoading(false));
  }, [fetchQuotations]);

  async function handleStatusChange(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/quotations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Status updated");
      fetchQuotations();
    } catch {
      toast.error("Failed to update status");
    }
  }

  const quotationTotal = (q: Quotation) =>
    q.items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Quotations</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage customer quotation requests</p>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-ink-muted">Reference</TableHead>
              <TableHead className="text-ink-muted">Customer</TableHead>
              <TableHead className="text-ink-muted">Email</TableHead>
              <TableHead className="text-ink-muted">Items</TableHead>
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
                      <Skeleton className="h-4 w-28 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-36 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12 bg-bone" />
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
              : quotations.map((q) => (
                  <TableRow key={q.id} className="border-border text-ink">
                    <TableCell className="font-medium text-accent-deep">{q.reference}</TableCell>
                    <TableCell className="font-medium">{q.customerName}</TableCell>
                    <TableCell className="text-ink-muted">{q.customerEmail}</TableCell>
                    <TableCell className="text-ink-muted">
                      {q.items.reduce((sum, i) => sum + i.quantity, 0)} items
                    </TableCell>
                    <TableCell>
                      <Select value={q.status} onValueChange={(v) => handleStatusChange(q.id, v)}>
                        <SelectTrigger
                          className={`h-7 w-fit gap-1 border-0 px-2 text-xs font-semibold ${statusColors[
                            q.status
                          ]
                            ?.split(" ")
                            .slice(0, 3)
                            .join(" ")}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-card text-ink">
                          {QUOTATION_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-ink-muted">{formatDate(new Date(q.createdAt))}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setViewing(q);
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
            <DialogTitle className="text-ink">Quotation {viewing?.reference ?? ""}</DialogTitle>
            <DialogDescription className="text-ink-muted">
              Submitted on {viewing ? formatDate(new Date(viewing.createdAt)) : ""}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted">Status</span>
                <Badge
                  variant="outline"
                  className={statusColors[viewing.status] || "border-border text-ink-muted"}
                >
                  {viewing.status}
                </Badge>
              </div>
              <Separator className="bg-border" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-ink-muted">Customer Name</p>
                  <p className="text-sm text-ink">{viewing.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Email</p>
                  <p className="text-sm text-ink">{viewing.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Phone</p>
                  <p className="text-sm text-ink">{viewing.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Signed-in as</p>
                  <p className="text-sm text-ink">{viewing.user?.email || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Address</p>
                <p className="mt-1 text-sm text-ink">{viewing.address || "—"}</p>
              </div>
              <Separator className="bg-border" />
              <div>
                <p className="mb-2 text-xs text-ink-muted">Items</p>
                <div className="space-y-2">
                  {viewing.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-bone px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{item.productNameSnapshot}</p>
                        <p className="text-xs text-ink-muted">
                          Qty: {item.quantity} × {formatPrice(item.priceSnapshot)}
                        </p>
                      </div>
                      <p className="ml-3 shrink-0 text-sm font-medium text-accent-deep">
                        {formatPrice(item.priceSnapshot * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-ink-light/5 flex items-center justify-between rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-ink">Estimated Total</span>
                <span className="text-base font-bold text-accent-deep">
                  {formatPrice(quotationTotal(viewing))}
                </span>
              </div>
              {viewing.notes && (
                <>
                  <Separator className="bg-border" />
                  <div>
                    <p className="text-xs text-ink-muted">Notes</p>
                    <p className="mt-1 text-sm text-ink">{viewing.notes}</p>
                  </div>
                </>
              )}
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
