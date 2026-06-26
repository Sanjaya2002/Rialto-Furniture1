"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.15, backgroundColor: "#16a34a", boxShadow: "0 8px 30px rgba(22,163,74,0.4)" }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-green-500"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(212,175,55,0.4)",
            "0 0 0 10px rgba(212,175,55,0)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <MessageCircle className="h-7 w-7 relative z-10" />
    </motion.a>
  );
}
