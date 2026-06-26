"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { fadeUp, staggerContainer, staggerItemFast } from "@/lib/animations";

export default function WhatsAppCTA() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <motion.section
      className="py-20 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div variants={fadeUp} className="max-w-4xl mx-auto">
        <motion.div
          className="gold-gradient rounded-2xl p-12 md:p-16 text-center relative overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-black/5" />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10"
          >
            <motion.h2
              variants={staggerItemFast}
              className="text-3xl md:text-4xl font-serif font-bold text-luxury-black mb-4"
            >
              Have Questions? Chat with Us!
            </motion.h2>
            <motion.p
              variants={staggerItemFast}
              className="text-luxury-black/80 text-lg mb-8 max-w-xl mx-auto"
            >
              Our team is ready to help you find the perfect furniture for your space. Reach out to us on WhatsApp.
            </motion.p>
            <motion.div variants={staggerItemFast}>
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-luxury-black text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg"
                whileHover={{ scale: 1.03, backgroundColor: "#1A1A1A" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
                Chat on WhatsApp
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
