"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE_CONFIG, SOLUTIONS, telHref, whatsappLink } from "@/lib/constants";
import { useCart } from "@/providers/cart-provider";
import { Logo } from "@/components/site/logo";
import { setScrollLocked } from "@/components/motion/smooth-scroll";
import { EASE_IN_OUT, EASE_OUT } from "@/components/motion/easing";
import { SolutionBar } from "@/components/site/layout/solution-bar";

/** Pages whose first section is full-bleed photography (nav starts light-on-dark). */
const OVERLAY_ROUTES = new Set(["/", "/about"]);

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, setOpen: setCartOpen, hydrated } = useCart();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > previous + 2);
    if (y < previous - 2) setHidden(false);
  });

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    setScrollLocked(menuOpen);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const overlay = OVERLAY_ROUTES.has(pathname) && !scrolled && !menuOpen;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,color,border-color] duration-500",
          overlay
            ? "border-b border-transparent text-paper"
            : "border-b border-line/70 bg-paper/85 text-ink backdrop-blur-md",
          menuOpen && "border-transparent bg-transparent text-paper backdrop-blur-0",
        )}
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <div className="container grid h-[68px] grid-cols-[1fr_auto_1fr] items-center md:h-[76px]">
          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="link-underline text-[0.82rem] tracking-[0.02em]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 justify-self-start text-[0.82rem] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="relative block h-[9px] w-6" aria-hidden>
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-out-expo",
                  menuOpen && "translate-y-[4px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-out-expo",
                  menuOpen && "-translate-y-[4px] -rotate-45",
                )}
              />
            </span>
            <span>{menuOpen ? "Close" : "Menu"}</span>
          </button>

          <Link href="/" aria-label={`${SITE_CONFIG.name} — home`} className="justify-self-center">
            <Logo tone={overlay || menuOpen ? "light" : "color"} className="w-[118px] md:w-[148px]" />
          </Link>

          <div className="flex items-center gap-6 justify-self-end text-[0.82rem]">
            <a
              href={telHref(SITE_CONFIG.phone)}
              className="link-underline hidden tabular-nums xl:inline-block"
            >
              {SITE_CONFIG.phone}
            </a>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="group flex items-center gap-2"
              aria-label={`Open cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
            >
              <span className="link-underline">Cart</span>
              <span
                className={cn(
                  "grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[0.7rem] tabular-nums transition-colors",
                  totalItems > 0 ? "bg-accent text-ink" : "ring-1 ring-inset ring-current",
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={hydrated ? totalItems : "x"}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                  >
                    {hydrated ? totalItems : 0}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </div>
        </div>
        {!menuOpen && <SolutionBar overlay={overlay} />}
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-ink text-paper lg:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
          >
            <nav
              aria-label="Mobile"
              className="container flex flex-1 flex-col justify-center gap-1 pb-6 pt-24"
            >
              {[{ label: "Home", href: "/" }, ...NAV_LINKS].map((link, i) => (
                <div key={link.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 + i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-baseline gap-4 py-1 font-display text-[clamp(2.6rem,11vw,4rem)] leading-[1.05]"
                    >
                      <span className="font-sans text-xs tabular-nums text-paper/40">0{i + 1}</span>
                      <span className={cn(isActive(link.href) && link.href !== "/" && "italic text-accent")}>
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.div
              className="pb-safe container border-t border-paper/10 py-8 text-sm text-paper/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-paper/40">
                Solutions
              </p>
              <ul className="mb-8 grid grid-cols-2 gap-x-6 gap-y-3">
                {SOLUTIONS.map((item) => (
                  <li key={item.productSlug}>
                    <Link href={`/product/${item.productSlug}`} className="block">
                      <span className="block font-semibold text-paper">{item.name}</span>
                      <span className="text-xs text-paper/50">{item.segment}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-paper/40">Call</p>
                  {SITE_CONFIG.phones.map((phone) => (
                    <a key={phone} href={telHref(phone)} className="block tabular-nums">
                      {phone}
                    </a>
                  ))}
                </div>
                <div>
                  <p className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-paper/40">Chat</p>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
