import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Current query params without "page". */
  query: Record<string, string>;
}

function pageList(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("…");
    result.push(p);
  });
  return result;
}

export function Pagination({ page, totalPages, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams(query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const arrow =
    "grid h-11 w-11 place-items-center rounded-full border border-input transition-colors hover:border-ink";

  return (
    <nav aria-label="Pagination" className="mt-20 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(page - 1)} className={arrow} aria-label="Previous page">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(arrow, "opacity-30")} aria-hidden>
          <ArrowLeft className="h-4 w-4" />
        </span>
      )}

      {pageList(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-ink-muted">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm tabular-nums transition-colors",
              p === page ? "bg-ink text-paper" : "hover:bg-bone",
            )}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={arrow} aria-label="Next page">
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(arrow, "opacity-30")} aria-hidden>
          <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
