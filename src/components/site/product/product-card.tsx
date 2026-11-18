"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { IMAGERY } from "@/lib/constants";
import type { ProductSummary } from "@/lib/types";
import { useCart } from "@/providers/cart-provider";
import { SmartImage } from "@/components/site/smart-image";

interface ProductCardProps {
  product: ProductSummary;
  /** Tall editorial tile vs. standard grid tile. */
  variant?: "default" | "feature";
  sizes?: string;
  priority?: boolean;
  index?: number;
}

export function ProductCard({
  product,
  variant = "default",
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  priority,
  index,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [primary, secondary] = product.images.length ? product.images : [IMAGERY.productFallback];
  const href = `/product/${product.slug}`;

  const add = () =>
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: primary,
      slug: product.slug,
    });

  return (
    <article className="group relative flex flex-col">
      <div
        className={cn(
          "relative overflow-hidden bg-bone",
          variant === "feature" ? "aspect-[4/5] md:aspect-[5/6]" : "aspect-[4/5]",
        )}
      >
        <Link href={href} aria-label={product.name} className="absolute inset-0 z-[1]" />
        <SmartImage
          src={primary}
          alt={product.name}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover transition-[transform,opacity] duration-[1.2s] ease-out-expo group-hover:scale-[1.04]",
            secondary && "group-hover:opacity-0",
          )}
        />
        {secondary && (
          <SmartImage
            src={secondary}
            alt=""
            fill
            sizes={sizes}
            className="scale-[1.04] object-cover opacity-0 transition-[transform,opacity] duration-[1.2s] ease-out-expo group-hover:scale-100 group-hover:opacity-100"
          />
        )}

        {index !== undefined && (
          <span className="pointer-events-none absolute left-3 top-3 z-[2] text-[0.7rem] tabular-nums text-ink/60 mix-blend-multiply">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        <button
          type="button"
          onClick={add}
          className="absolute bottom-3 right-3 z-[2] flex h-10 items-center gap-2 rounded-full bg-paper/95 px-3 text-xs font-medium text-ink shadow-sm backdrop-blur transition-[transform,opacity,background-color] duration-500 ease-out-expo hover:bg-ink hover:text-paper md:translate-y-3 md:px-4 md:opacity-0 md:focus-visible:translate-y-0 md:focus-visible:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Add to cart</span>
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1 sm:mt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          {product.category && (
            <p className="mb-1 text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted">
              {product.category.name}
            </p>
          )}
          <h3 className="font-sans text-[0.95rem] font-medium leading-snug md:text-base">
            <Link
              href={href}
              className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px]"
            >
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="shrink-0 text-[0.9rem] tabular-nums text-ink-soft">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
