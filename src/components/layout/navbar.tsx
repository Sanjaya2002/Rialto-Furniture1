"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { useCart } from "@/providers/cart-provider";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { navLinkUnderline, staggerContainer, staggerItemFast } from "@/lib/animations";

const MotionLink = motion.create(Link);

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { isScrolled } = useScrollDirection();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      animate={{
        backgroundColor: isScrolled ? "rgba(11, 11, 11, 0.95)" : "rgba(11, 11, 11, 0.8)",
        backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        boxShadow: isScrolled ? "0 1px 3px rgba(0,0,0,0.3)" : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between"
          animate={{ height: isScrolled ? "4rem" : "5rem" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              className="text-2xl font-serif font-bold gold-text"
              animate={{ fontSize: isScrolled ? "1.3rem" : "1.5rem" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Rialto
            </motion.span>
            <span className="text-sm text-white/60 hidden sm:block">Furniture</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <MotionLink
                key={link.href}
                href={link.href}
                className="relative text-sm text-white/70 hover:text-gold transition-colors uppercase tracking-wider"
                whileHover="hover"
              >
                {link.label}
                
              </MotionLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/cart" className="relative text-white/70 hover:text-gold transition-colors block">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gold text-luxury-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            <motion.button
              className="lg:hidden text-white/70 hover:text-gold"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </motion.div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden bg-luxury-black border-t border-white/10 overflow-hidden"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="px-4 py-6 space-y-4"
            >
              {NAV_LINKS.map((link) => (
                <motion.div key={link.href} variants={staggerItemFast}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-white/70 hover:text-gold transition-colors uppercase tracking-wider text-sm"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
