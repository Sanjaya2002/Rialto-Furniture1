"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { IMAGERY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/components/site/smart-image";
import { SplitText } from "@/components/motion/split-text";
import { QuantityStepper } from "./quantity-stepper";
import { EASE_OUT } from "@/components/motion/easing";

export function CartView() {
  const { items, hydrated, totalItems, totalPrice, updateQuantity, removeItem } = useCart();

  return (
    <div className="container pb-24 pt-32 md:pb-36 md:pt-44">
      <p className="eyebrow mb-6">Your selection</p>
      <SplitText as="h1" immediate text="Cart" className="mb-12 text-display-lg md:mb-16" />

      {!hydrated ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-start gap-6 border-t pt-12">
          <p className="font-display text-display-sm">Your cart is empty.</p>
          <p className="max-w-md text-ink-muted">
            Browse the collection and add the pieces you’re considering — we’ll quote for the full set.
          </p>
          <Button asChild size="lg">
            <Link href="/shop">Explore the collection</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <div className="hidden grid-cols-[1fr_9rem_8rem] gap-6 border-b pb-3 text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted md:grid">
              <span>Piece</span>
              <span>Quantity</span>
              <span className="text-right">Subtotal</span>
            </div>
            <ul className="divide-y border-b">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.35, ease: EASE_OUT } }}
                    className="grid grid-cols-[5.5rem_1fr] gap-x-5 gap-y-4 py-6 md:grid-cols-[1fr_9rem_8rem] md:items-center md:gap-6"
                  >
                    <div className="flex gap-5 md:items-center">
                      <div className="relative aspect-[4/5] w-[5.5rem] shrink-0 overflow-hidden bg-bone md:w-24">
                        <SmartImage
                          src={item.image || IMAGERY.productFallback}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="hidden min-w-0 md:block">
                        <ItemName name={item.name} slug={item.slug} />
                        <p className="mt-1 text-sm tabular-nums text-ink-muted">
                          {formatPrice(item.price)} each
                        </p>
                        <RemoveButton onClick={() => removeItem(item.id)} />
                      </div>
                    </div>

                    <div className="min-w-0 md:hidden">
                      <ItemName name={item.name} slug={item.slug} />
                      <p className="mt-1 text-sm tabular-nums text-ink-muted">
                        {formatPrice(item.price)} each
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <QuantityStepper
                          size="sm"
                          value={item.quantity}
                          onChange={(q) => updateQuantity(item.id, q)}
                        />
                        <p className="tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <RemoveButton onClick={() => removeItem(item.id)} />
                    </div>

                    <div className="hidden md:block">
                      <QuantityStepper
                        size="sm"
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.id, q)}
                      />
                    </div>
                    <p className="hidden text-right tabular-nums md:block">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <Link href="/shop" className="link-underline mt-8 inline-block text-sm">
              ← Continue browsing
            </Link>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-card p-6 md:p-8 lg:sticky lg:top-28">
              <h2 className="font-display text-2xl">Summary</h2>
              <dl className="mt-6 space-y-3 border-b pb-6 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Pieces</dt>
                  <dd className="tabular-nums">{totalItems}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Delivery & setup</dt>
                  <dd>In quotation</dd>
                </div>
              </dl>
              <div className="flex items-baseline justify-between py-6">
                <span>Estimated total</span>
                <span className="font-display text-3xl tabular-nums">{formatPrice(totalPrice)}</span>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Request quotation</Link>
              </Button>
              <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                No payment is taken online. Our team confirms pricing, volume discounts and delivery dates in
                a written quotation.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function ItemName({ name, slug }: { name: string; slug?: string }) {
  return slug ? (
    <Link href={`/product/${slug}`} className="font-medium leading-snug hover:underline">
      {name}
    </Link>
  ) : (
    <p className="font-medium leading-snug">{name}</p>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
    >
      Remove
    </button>
  );
}
