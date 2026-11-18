"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { SOLUTIONS, whatsappLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/site/icons";
import { EASE_OUT } from "@/components/motion/easing";

/**
 * Desktop "solution bar": a slim row under the main header listing the Rialto product lines,
 * with a mega panel (opened on hover or click) that describes each one.
 */
export function SolutionBar({ overlay }: { overlay: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const isActive = (slug: string) => pathname === `/product/${slug}`;

  return (
    <div
      className={cn(
        "relative hidden border-t transition-colors duration-500 lg:block",
        overlay && !open ? "border-paper/15" : "border-line/70",
        open && "bg-paper text-ink",
      )}
      onMouseLeave={hide}
    >
      <div className="container flex h-11 items-center gap-8 text-[0.8rem]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={show}
          aria-expanded={open}
          aria-controls="solutions-panel"
          className="flex items-center gap-2 font-semibold uppercase tracking-[0.14em]"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Solutions
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform duration-300", open && "rotate-180")}
          />
        </button>

        <nav aria-label="Solutions" className="flex items-center gap-7" onMouseEnter={show}>
          {SOLUTIONS.map((item) => (
            <Link
              key={item.productSlug}
              href={`/product/${item.productSlug}`}
              aria-current={isActive(item.productSlug) ? "page" : undefined}
              className="link-underline font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappLink("Hi Rialto Furniture, I'd like help choosing the right chairs for our space.")}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline ml-auto hidden xl:inline-block"
        >
          Talk to a consultant
        </a>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="solutions-panel"
            className="absolute inset-x-0 top-full border-y border-line bg-paper text-ink shadow-[0_24px_48px_-24px_rgba(15,34,53,0.25)]"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            onMouseEnter={show}
          >
            <div className="container grid grid-cols-5 gap-6 py-8">
              {SOLUTIONS.map((item) => (
                <div key={item.productSlug} className="flex flex-col border-l border-line pl-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent-deep">
                    {item.segment}
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold">{item.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.tagline}</p>
                  <div className="mt-auto flex flex-col gap-2 pt-5 text-[0.8rem] font-medium">
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="group inline-flex items-center gap-1.5 hover:text-accent-deep"
                    >
                      View details
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href={`/shop?category=${item.categorySlug}`}
                      className="text-ink-muted hover:text-ink"
                    >
                      See the range
                    </Link>
                  </div>
                </div>
              ))}
              <div className="flex flex-col justify-between rounded-sm bg-ink p-6 text-paper">
                <div>
                  <p className="font-display text-lg font-semibold">Not sure which fits?</p>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">
                    Tell us about your space and we’ll recommend the right chairs.
                  </p>
                </div>
                <a
                  href={whatsappLink(
                    "Hi Rialto Furniture, I'd like help choosing the right chairs for our space.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#25D366]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Talk to a consultant
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
