import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import { getDashboardStats } from "@/server/services/stats";
import { safely } from "@/server/safely";
import { AdminHeader } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await safely(getDashboardStats, null, "admin stats");

  if (!stats) {
    return (
      <>
        <AdminHeader title="Dashboard" />
        <p className="rounded-sm border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Could not load statistics. Check the database connection (DATABASE_URL) and try again.
        </p>
      </>
    );
  }

  const cards = [
    {
      label: "Pending quotations",
      value: stats.pendingQuotations,
      href: "/admin/quotations",
      highlight: stats.pendingQuotations > 0,
    },
    { label: "All quotations", value: stats.totalQuotations, href: "/admin/quotations" },
    { label: "Products", value: stats.totalProducts, href: "/admin/products" },
    { label: "Categories", value: stats.totalCategories, href: "/admin/categories" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" description="What needs your attention today." />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border bg-line lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group bg-card p-5 transition-colors hover:bg-bone md:p-6"
          >
            <p className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-ink-muted">
              {card.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </p>
            <p className="mt-4 flex items-center gap-2 font-display text-4xl tabular-nums">
              {card.value}
              {card.highlight && <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-sm border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-display text-2xl">Latest quotation requests</h2>
          <Link href="/admin/quotations" className="text-sm text-ink-muted hover:text-ink">
            View all
          </Link>
        </div>
        {stats.recentQuotations.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-muted">No quotation requests yet.</p>
        ) : (
          <ul className="divide-y">
            {stats.recentQuotations.map((q) => (
              <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{q.customerName}</p>
                  <p className="text-xs text-ink-muted">
                    {q.reference} · {formatDate(q.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="tabular-nums">{formatPrice(q.total)}</span>
                  <StatusBadge status={q.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {stats.totalOrders > 0 && (
        <p className="mt-6 text-xs text-ink-muted">
          Archive: {stats.totalOrders} legacy order{stats.totalOrders === 1 ? "" : "s"} · completed revenue{" "}
          {formatPrice(stats.totalRevenue)}
        </p>
      )}
    </>
  );
}
