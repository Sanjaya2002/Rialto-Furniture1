import type { Metadata } from "next";
import Link from "next/link";
import { toProductSummary } from "@/lib/types";
import { listCategories } from "@/server/services/categories";
import { listProducts, parseSort } from "@/server/services/products";
import { safely } from "@/server/safely";
import { PageHeader } from "@/components/site/page-header";
import { ShopToolbar } from "@/components/site/shop/shop-toolbar";
import { Pagination } from "@/components/site/shop/pagination";
import { ProductCard } from "@/components/site/product/product-card";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const category = first((await searchParams).category);
  const categories = await safely(listCategories, [], "shop metadata");
  const match = categories.find((c) => c.slug === category);
  return {
    title: match ? match.name : "Shop all furniture",
    description:
      match?.description ??
      "Office chairs, executive seating, reception and lecture furniture — browse the Rialto collection.",
    alternates: { canonical: match ? `/shop?category=${match.slug}` : "/shop" },
  };
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = first(params.category);
  const search = first(params.search).slice(0, 100);
  const sortParam = first(params.sort);
  const page = Math.max(1, Number(first(params.page)) || 1);

  const [categories, result] = await Promise.all([
    safely(listCategories, [], "shop categories"),
    safely(
      () =>
        listProducts({
          category: category || undefined,
          search: search || undefined,
          sort: parseSort(sortParam),
          page,
          limit: PAGE_SIZE,
        }),
      null,
      "shop products",
    ),
  ]);

  const active = categories.find((c) => c.slug === category);
  const query = Object.fromEntries(
    Object.entries({ category, search, sort: sortParam }).filter(([, v]) => v),
  ) as Record<string, string>;

  return (
    <>
      <PageHeader
        eyebrow={active ? "Range" : "The collection"}
        title={active ? active.name : "Furniture for\nwork & *welcome*"}
        description={
          active?.description ??
          "Executive and task seating, reception pieces and lecture furniture. Add what you like to your cart and we’ll quote for the whole space."
        }
      />

      <ShopToolbar
        categories={categories.map((c) => ({ name: c.name, slug: c.slug, count: c._count.products }))}
        total={result?.total ?? 0}
      />

      <section className="container pb-24 pt-8 md:pb-36 md:pt-10">
        {result === null ? (
          <EmptyState
            title="The collection is taking a moment."
            body="We couldn’t load products just now. Please refresh, or message us and we’ll help directly."
          />
        ) : result.products.length === 0 ? (
          <EmptyState
            title={search ? `Nothing matches “${search}”.` : "Nothing in this range yet."}
            body="Try another range or search term — or tell us what you need and we’ll source or make it."
          />
        ) : (
          <>
            <p className="mb-8 text-sm tabular-nums text-ink-muted">
              {result.total} piece{result.total === 1 ? "" : "s"}
              {search && <> for “{search}”</>}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {result.products.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 0.06} y={20}>
                  <ProductCard product={toProductSummary(product)} priority={i < 4} />
                </Reveal>
              ))}
            </div>
            <Pagination page={result.page} totalPages={result.totalPages} query={query} />
          </>
        )}
      </section>
    </>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-24 text-center">
      <p className="font-display text-display-sm">{title}</p>
      <p className="mt-4 text-ink-muted">{body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/shop">Clear filters</Link>
        </Button>
        <Button asChild>
          <Link href="/custom-order">Request something custom</Link>
        </Button>
      </div>
    </div>
  );
}
