"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { cn, formatProductPrice } from "@/lib/utils";
import { IMAGERY, productEnquiryLink } from "@/lib/constants";
import type { ProductSummary } from "@/lib/types";
import { useCart } from "@/providers/cart-provider";
import { SmartImage } from "@/components/site/smart-image";
import { WhatsAppIcon } from "@/components/site/icons";

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
    <article className="group relative flex h-full flex-col">
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

      <div className="mt-4 flex flex-1 flex-col">
        {product.category && (
          <p className="mb-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent-deep">
            {product.category.name}
          </p>
        )}
        <h3 className="font-display text-[1.02rem] font-semibold leading-snug md:text-[1.15rem]">
          <Link
            href={href}
            className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px]"
          >
            {product.name}
          </Link>
        </h3>
        {product.summary && (
          <p className="mt-1.5 line-clamp-2 text-[0.85rem] leading-relaxed text-ink-muted">
            {product.summary}
          </p>
        )}
        <p className="mt-3 font-display text-[1.05rem] font-bold tabular-nums text-ink md:text-lg">
          {formatProductPrice(product.price)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-[0.8rem] font-medium">
          <Link
            href={href}
            className="group/link inline-flex items-center gap-1.5 text-ink hover:text-accent-deep"
          >
            View details
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
          </Link>
          <a
            href={productEnquiryLink(product.name, product.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#128C4B] hover:text-[#0b6b38]"
            aria-label={`Inquire about ${product.name} on WhatsApp`}
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>
              <span className="hidden sm:inline">Inquire on </span>WhatsApp
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
