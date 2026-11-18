"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { whatsappLink } from "@/lib/constants";
import { EASE_OUT } from "@/components/motion/easing";
import { WhatsAppIcon } from "@/components/site/icons";

/** WhatsApp entry point that appears once the visitor scrolls (hidden where the page has its own sticky bar). */
export function WhatsAppFab() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 500));

  const hidden = pathname.startsWith("/product/") || pathname === "/checkout";

  return (
    <AnimatePresence>
      {visible && !hidden && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="group fixed bottom-5 right-5 z-30 flex h-12 items-center gap-2 rounded-full bg-ink pl-3 pr-4 text-sm text-paper shadow-lg shadow-ink/20 md:bottom-8 md:right-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
          <span className="hidden sm:inline">Chat with us</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
