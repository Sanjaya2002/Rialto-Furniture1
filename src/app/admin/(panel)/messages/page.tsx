"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONTACT_STATUSES, telHref } from "@/lib/constants";
import { apiRequest, errorMessage, jsonBody } from "@/lib/api-client";
import { cn, formatDate } from "@/lib/utils";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  New: "border-amber-200 bg-amber-100 text-amber-900",
  Read: "border-sky-200 bg-sky-100 text-sky-900",
  Replied: "border-emerald-200 bg-emerald-100 text-emerald-900",
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setMessages(await apiRequest<ContactMessage[]>("/api/contact"));
    } catch (error) {
      toast.error(errorMessage(error, "Could not load messages"));
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  async function setStatus(id: string, status: string) {
    try {
      await apiRequest(`/api/contact/${id}`, jsonBody({ status }, "PATCH"));
      setMessages((list) => list.map((m) => (m.id === id ? { ...m, status } : m)));
    } catch (error) {
      toast.error(errorMessage(error, "Could not update status"));
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    try {
      await apiRequest(`/api/contact/${id}`, { method: "DELETE" });
      setMessages((list) => list.filter((m) => m.id !== id));
      toast.success("Message deleted");
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete message"));
    }
  }

  const unread = messages.filter((m) => m.status === "New").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Messages</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Sent from the website contact form{unread > 0 && ` · ${unread} new`}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full bg-bone" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <p className="rounded-lg border bg-card p-10 text-center text-ink-muted">No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "rounded-lg border bg-card p-6",
                m.status === "New" && "border-l-4 border-l-accent",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink">{m.name}</p>
                  <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                      <Mail className="h-3.5 w-3.5" /> {m.email}
                    </a>
                    {m.phone && (
                      <a href={telHref(m.phone)} className="inline-flex items-center gap-1.5 hover:text-ink">
                        <Phone className="h-3.5 w-3.5" /> {m.phone}
                      </a>
                    )}
                    <span>{formatDate(m.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={STATUS_STYLES[m.status]}>
                    {m.status}
                  </Badge>
                  <Select value={m.status} onValueChange={(v) => setStatus(m.id, v)}>
                    <SelectTrigger className="h-9 w-32 border-border bg-card text-ink">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card text-ink">
                      {CONTACT_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(m.id)}
                    className="text-ink-muted hover:text-destructive"
                    aria-label="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
