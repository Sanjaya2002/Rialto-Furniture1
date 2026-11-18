import { cn } from "@/lib/utils";

export const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-900 border-amber-200",
  "In Review": "bg-sky-100 text-sky-900 border-sky-200",
  Processing: "bg-sky-100 text-sky-900 border-sky-200",
  Approved: "bg-emerald-100 text-emerald-900 border-emerald-200",
  Completed: "bg-emerald-100 text-emerald-900 border-emerald-200",
  Rejected: "bg-rose-100 text-rose-900 border-rose-200",
  Cancelled: "bg-rose-100 text-rose-900 border-rose-200",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "border-line bg-bone text-ink-soft",
        className,
      )}
    >
      {status}
    </span>
  );
}
