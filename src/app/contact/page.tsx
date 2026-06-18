import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_CONFIG.name}. Visit our showroom, call us, or send us a message.`,
  openGraph: {
    title: `Contact Us | ${SITE_CONFIG.name}`,
    description: `Get in touch with ${SITE_CONFIG.name}. Visit our showroom, call us, or send us a message.`,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28">
      <section className="bg-luxury-gray py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-black">
            Get in <span className="text-gold">Touch</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Reach out for inquiries, quotes, or custom orders.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-xl font-bold">P</span>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">Phone</h3>
              <p className="text-muted-foreground">{SITE_CONFIG.phone}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-xl font-bold">@</span>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">Email</h3>
              <p className="text-muted-foreground">{SITE_CONFIG.email}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-xl font-bold">A</span>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">Address</h3>
              <p className="text-muted-foreground">{SITE_CONFIG.address}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-luxury-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm />
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">[Google Maps Placeholder]</p>
                <p className="text-sm text-muted-foreground">{SITE_CONFIG.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-luxury-black mb-4">Prefer WhatsApp?</h2>
          <p className="text-muted-foreground mb-6">
            Chat with us directly on WhatsApp for quick inquiries and support.
          </p>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-dark transition-colors"
          >
            Message us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
