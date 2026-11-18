import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SITE_CONFIG, whatsappLink } from "@/lib/constants";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/forms/contact-form";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to ${SITE_CONFIG.name} — call, WhatsApp, email or visit our Colombo showroom.`,
  alternates: { canonical: "/contact" },
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_CONFIG.address)}`;

export default function ContactPage() {
  const channels = [
    { label: "WhatsApp", value: "Chat with our team", href: whatsappLink(), external: true },
    { label: "Call", value: SITE_CONFIG.phone, href: `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}` },
    { label: "Email", value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
    { label: "Showroom", value: SITE_CONFIG.address, href: mapsUrl, external: true },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={"Let’s talk about\nyour *space*"}
        description="Questions, quotations, site visits or a custom brief — reach us however suits you."
      />

      <section className="container grid gap-16 border-t pb-24 pt-12 md:pb-36 lg:grid-cols-12">
        <RevealGroup className="lg:col-span-5">
          {channels.map((c) => (
            <RevealItem key={c.label}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-start justify-between gap-6 border-b py-6"
              >
                <span>
                  <span className="mb-1 block text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
                    {c.label}
                  </span>
                  <span className="text-lg md:text-xl">{c.value}</span>
                </span>
                <ArrowUpRight className="mt-5 h-5 w-5 shrink-0 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent-deep" />
              </a>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="mb-8 font-display text-3xl">Send a message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
