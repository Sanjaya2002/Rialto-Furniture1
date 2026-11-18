import Link from "next/link";
import type { ProductSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/site/product/product-card";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

/** Asymmetric editorial grid: one tall feature tile, the rest in a tighter rhythm. */
export function FeaturedProducts({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) return null;
  const [feature, ...rest] = products;

  return (
    <section className="container py-24 md:py-36">
      <div className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="eyebrow mb-5">03 — Selected pieces</p>
          <SplitText text={"Chosen for the\n*long* workday"} className="text-display-lg" />
        </div>
        <p className="max-w-sm text-ink-muted md:col-span-4 md:justify-self-end">
          A short edit of what our clients reach for most — tested for comfort, built for years of daily use.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-12 lg:gap-y-16">
        <Reveal className="col-span-2 lg:col-span-6 lg:row-span-2">
          <ProductCard
            product={feature}
            variant="feature"
            index={0}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Reveal>
        {rest.slice(0, 4).map((product, i) => (
          <Reveal
            key={product.id}
            delay={(i % 2) * 0.08}
            className={cn("lg:col-span-3", i % 2 === 1 && "lg:mt-16")}
          >
            <ProductCard product={product} index={i + 1} sizes="(min-width: 1024px) 25vw, 50vw" />
          </Reveal>
        ))}
      </div>

      <div className="mt-16 flex justify-center md:mt-24">
        <Button asChild variant="outline" size="lg">
          <Link href="/shop">See the full collection</Link>
        </Button>
      </div>
    </section>
  );
}
