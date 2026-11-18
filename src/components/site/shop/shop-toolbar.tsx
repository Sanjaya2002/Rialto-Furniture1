"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShopToolbarProps {
  categories: { name: string; slug: string; count: number }[];
  total: number;
}

const SORTS = [
  { value: "", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export function ShopToolbar({ categories, total }: ShopToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  const urlSearch = params.get("search") ?? "";
  const [search, setSearch] = useState(urlSearch);

  useEffect(() => setSearch(urlSearch), [urlSearch]);

  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    const query = next.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  };

  useEffect(() => {
    if (search === urlSearch) return;
    const timer = setTimeout(() => update({ search: search.trim() }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const activeCount = (category ? 1 : 0) + (sort ? 1 : 0);

  const pills = (
    <>
      <Pill active={!category} onClick={() => update({ category: "" })}>
        All
      </Pill>
      {categories.map((c) => (
        <Pill key={c.slug} active={category === c.slug} onClick={() => update({ category: c.slug })}>
          {c.name}
          <span className="ml-1.5 text-[0.7em] tabular-nums opacity-60">{c.count}</span>
        </Pill>
      ))}
    </>
  );

  return (
    <div className="border-y">
      <div className="container flex items-center gap-3 py-3">
        <div className="no-scrollbar -my-1 hidden flex-1 gap-2 overflow-x-auto py-1 md:flex">{pills}</div>

        <label className="relative flex flex-1 items-center md:max-w-[15rem] md:flex-none">
          <span className="sr-only">Search furniture</span>
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-ink-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="h-10 w-full rounded-full border border-input bg-card pl-9 pr-9 text-sm placeholder:text-ink-muted focus:border-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 grid h-6 w-6 place-items-center rounded-full text-ink-muted hover:bg-bone hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>

        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="hidden h-10 rounded-full border border-input bg-card px-4 text-sm focus:border-ink focus:outline-none md:block"
          aria-label="Sort products"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex h-10 items-center gap-2 rounded-full border border-input bg-card px-4 text-sm md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-[0.7rem] text-ink">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <div
        className={cn(
          "h-px origin-left bg-ink transition-transform duration-700 ease-out-expo",
          pending ? "scale-x-75" : "scale-x-0",
        )}
        aria-hidden
      />

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent side="bottom">
          <DialogTitle>Filter</DialogTitle>
          <DialogDescription>
            {total} piece{total === 1 ? "" : "s"} match
          </DialogDescription>
          <p className="mb-3 mt-8 text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">Range</p>
          <div className="flex flex-wrap gap-2">{pills}</div>
          <p className="mb-3 mt-8 text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">Sort by</p>
          <div className="flex flex-wrap gap-2">
            {SORTS.map((s) => (
              <Pill key={s.value} active={sort === s.value} onClick={() => update({ sort: s.value })}>
                {s.label}
              </Pill>
            ))}
          </div>
          <Button className="mt-10 w-full" size="lg" onClick={() => setFiltersOpen(false)}>
            Show results
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-[0.82rem] transition-colors duration-300",
        active ? "border-ink bg-ink text-paper" : "border-input bg-transparent hover:border-ink",
      )}
    >
      {children}
    </button>
  );
}
