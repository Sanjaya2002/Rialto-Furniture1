"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Truck, Wrench, FileText, ShieldCheck } from "lucide-react";
import { formatPrice, formatProductPrice, hasPrice } from "@/lib/utils";
import { productEnquiryLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/site/icons";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/site/cart/quantity-stepper";
import { EASE_OUT } from "@/components/motion/easing";

interface ProductPurchaseProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    image: string;
    categoryName?: string;
  };
  rating?: { average: number; count: number };
}

const ASSURANCES = [
  { icon: FileText, text: "Free, no-obligation quotation — no payment online" },
  { icon: Truck, text: "Delivery anywhere in Sri Lanka" },
  { icon: Wrench, text: "Assembly and setup by our team" },
  { icon: ShieldCheck, text: "1-year+ warranty and after-sales support" },
];

export function ProductPurchase({ product, rating }: ProductPurchaseProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) =>
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(t);
  }, [added]);

  const add = (qty = quantity) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image,
      slug: product.slug,
    });
    setAdded(true);
  };

  const enquiry = productEnquiryLink(product.name, product.slug);
  const priced = hasPrice(product.price);

  return (
    <div className="flex flex-col">
      {product.categoryName && <p className="eyebrow mb-5">{product.categoryName}</p>}
      <h1 className="text-display-md">{product.name}</h1>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <p className="font-display text-3xl font-bold tabular-nums">{formatProductPrice(product.price)}</p>
        {rating && rating.count > 0 && (
          <a href="#reviews" className="text-sm text-ink-muted underline-offset-4 hover:underline">
            <span className="text-accent">★</span> {rating.average.toFixed(1)} · {rating.count} review
            {rating.count === 1 ? "" : "s"}
          </a>
        )}
      </div>
      <p className="mt-1 text-xs text-ink-muted">
        {priced
          ? "Guide price per unit. Volume pricing is confirmed in your quotation."
          : "Pricing depends on quantity and configuration. Ask us for a quotation."}
      </p>

      <p className="mt-8 whitespace-pre-line leading-relaxed text-ink-soft">{product.description}</p>

      <div ref={ctaRef} className="mt-10 flex flex-col gap-3 sm:flex-row">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <Button size="lg" className="h-12 flex-1" onClick={() => add()}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? "added" : "add"}
              className="flex items-center gap-2"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              {added ? (
                <>
                  <Check /> Added to cart
                </>
              ) : (
                <>Add to cart{priced && <> — {formatPrice(product.price * quantity)}</>}</>
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>
      <Button
        asChild
        size="lg"
        className="mt-3 h-12 bg-[#1DA851] text-white hover:bg-[#178a43] [&_svg]:size-5"
      >
        <a href={enquiry} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon /> Inquire on WhatsApp
        </a>
      </Button>

      <ul className="mt-10 divide-y border-y">
        {ASSURANCES.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-4 py-4 text-sm text-ink-soft">
            <Icon className="h-4 w-4 shrink-0 text-accent-deep" />
            {text}
          </li>
        ))}
      </ul>

      {/* Mobile sticky bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-30 border-t bg-paper/95 backdrop-blur-md md:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <div className="pb-safe container flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-xs tabular-nums text-ink-muted">{formatProductPrice(product.price)}</p>
              </div>
              <Button
                asChild
                size="icon"
                className="h-11 w-11 shrink-0 bg-[#1DA851] text-white hover:bg-[#178a43] [&_svg]:size-5"
              >
                <a href={enquiry} target="_blank" rel="noopener noreferrer" aria-label="Inquire on WhatsApp">
                  <WhatsAppIcon />
                </a>
              </Button>
              <Button onClick={() => add(1)}>{added ? "Added" : "Add to cart"}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
