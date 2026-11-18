"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/providers/cart-provider";
import { formatPrice, formatProductPrice, hasPrice } from "@/lib/utils";
import { IMAGERY } from "@/lib/constants";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/site/smart-image";
import { QuantityStepper } from "./quantity-stepper";
import { setScrollLocked } from "@/components/motion/smooth-scroll";
import { EASE_OUT } from "@/components/motion/easing";

export function CartDrawer() {
  const { items, isOpen, setOpen, totalPrice, totalItems, updateQuantity, removeItem } = useCart();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname, setOpen]);
  useEffect(() => setScrollLocked(isOpen), [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent side="right" className="p-0">
        <div className="flex items-baseline justify-between border-b px-6 pb-5 pt-6">
          <DialogTitle className="text-3xl">
            Cart <span className="font-sans text-sm tabular-nums text-ink-muted">({totalItems})</span>
          </DialogTitle>
          <DialogDescription className="sr-only">Items you have selected for a quotation</DialogDescription>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-display text-2xl">Nothing here yet.</p>
            <p className="max-w-xs text-sm text-ink-muted">
              Add pieces you like and we’ll put together a tailored quotation for your space.
            </p>
            <Button asChild variant="outline">
              <Link href="/shop">Browse the collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto overscroll-contain px-6" data-lenis-prevent>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="flex gap-4 py-5"
                  >
                    <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-bone">
                      <SmartImage
                        src={item.image || IMAGERY.productFallback}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        {item.slug ? (
                          <Link
                            href={`/product/${item.slug}`}
                            className="line-clamp-2 font-medium leading-snug hover:underline"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <p className="line-clamp-2 font-medium leading-snug">{item.name}</p>
                        )}
                        <p className="shrink-0 text-sm tabular-nums">
                          {formatProductPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <p className="mt-1 text-xs tabular-nums text-ink-muted">
                        {formatProductPrice(item.price)}
                        {hasPrice(item.price) && " each"}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <QuantityStepper
                          size="sm"
                          value={item.quantity}
                          onChange={(q) => updateQuantity(item.id, q)}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="pb-safe border-t bg-card px-6 pb-6 pt-5">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm text-ink-soft">Estimated total</span>
                <span className="font-display text-2xl tabular-nums">{formatPrice(totalPrice)}</span>
              </div>
              <p className="mb-5 text-xs text-ink-muted">
                No payment now — we confirm final pricing, delivery and any bulk discount in your quotation.
              </p>
              <div className="grid gap-2">
                <Button asChild size="lg">
                  <Link href="/checkout">Request quotation</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/cart">View full cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
