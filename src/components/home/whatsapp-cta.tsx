"use client";

import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function WhatsAppCTA() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="gold-gradient rounded-2xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black mb-4">
              Have Questions? Chat with Us!
            </h2>
            <p className="text-luxury-black/80 text-lg mb-8 max-w-xl mx-auto">
              Our team is ready to help you find the perfect furniture for your space. Reach out to us on WhatsApp.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-luxury-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-charcoal transition-colors shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
