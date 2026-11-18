import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SITE_CONFIG, SOCIAL_LINKS, mapsHref, telHref, whatsappLink } from "@/lib/constants";
import { SOCIAL_ICONS } from "@/components/site/icons";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/forms/contact-form";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to ${SITE_CONFIG.name} — call, WhatsApp, email or visit our Yakkala showroom.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const channels = [
    { label: "WhatsApp", value: SITE_CONFIG.whatsappDisplay, href: whatsappLink(), external: true },
    ...SITE_CONFIG.phones.map((phone, i) => ({
      label: i === 0 ? "Call" : "Call (alternate)",
      value: phone,
      href: telHref(phone),
      external: false,
    })),
    ...SITE_CONFIG.emails.map((email) => ({
      label: `Email · ${email.label}`,
      value: email.address,
      href: `mailto:${email.address}`,
      external: false,
    })),
    { label: "Showroom", value: SITE_CONFIG.address, href: mapsHref, external: true },
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
          <RevealItem className="pt-8">
            <span className="mb-3 block text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
              Follow us
            </span>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </RevealItem>
        </RevealGroup>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="mb-8 font-display text-3xl">Send a message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
