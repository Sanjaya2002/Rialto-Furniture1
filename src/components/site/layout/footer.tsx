import Link from "next/link";
import { ArrowUpRight, CreditCard, Handshake, ShieldCheck, Truck } from "lucide-react";
import {
  NAV_LINKS,
  SERVICE_PROMISES,
  SITE_CONFIG,
  SOCIAL_LINKS,
  SOLUTIONS,
  mapsHref,
  telHref,
  whatsappLink,
} from "@/lib/constants";
import { Logo } from "@/components/site/logo";
import { SOCIAL_ICONS } from "@/components/site/icons";
import { SplitText } from "@/components/motion/split-text";

const PROMISE_ICONS = {
  delivery: Truck,
  warranty: ShieldCheck,
  support: Handshake,
  payment: CreditCard,
} as const;

interface FooterProps {
  categories: { name: string; slug: string }[];
}

export function Footer({ categories }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <>
      <section aria-label="Our promises" className="border-t bg-card">
        <ul className="container grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:py-12 lg:grid-cols-4">
          {SERVICE_PROMISES.map((promise) => {
            const Icon = PROMISE_ICONS[promise.key];
            return (
              <li key={promise.key} className="flex flex-col items-center gap-3 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent-deep">
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <span>
                  <span className="block font-display text-[0.95rem] font-bold md:text-base">
                    {promise.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-muted md:text-sm">
                    {promise.body}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
      <footer className="relative overflow-hidden bg-ink text-paper">
        <div className="container pb-10 pt-20 md:pt-28">
          <div className="grid gap-12 border-b border-paper/10 pb-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-6 text-paper/50">Start a project</p>
              <SplitText
                as="h2"
                text={"Let’s furnish\nsomething *good.*"}
                className="text-display-lg [&_.text-accent-deep]:text-accent"
              />
            </div>
            <div className="flex flex-col justify-end gap-3 lg:col-span-5 lg:items-end">
              <a
                href={whatsappLink("Hello Rialto, I'd like to talk about furniture for our space.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-between border-b border-paper/20 py-4 text-lg transition-colors hover:border-accent lg:max-w-sm"
              >
                Chat on WhatsApp
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
              </a>
              {SITE_CONFIG.emails.map((email) => (
                <a
                  key={email.address}
                  href={`mailto:${email.address}`}
                  className="group flex w-full items-center justify-between gap-4 border-b border-paper/20 py-4 text-lg transition-colors hover:border-accent lg:max-w-sm"
                >
                  <span className="min-w-0 truncate">{email.address}</span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 py-14 text-sm md:grid-cols-3 lg:grid-cols-5">
            <FooterColumn title="Solutions">
              {SOLUTIONS.map((item) => (
                <FooterLink key={item.productSlug} href={`/product/${item.productSlug}`}>
                  {item.name}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title="Shop">
              <FooterLink href="/shop">All furniture</FooterLink>
              {categories.slice(0, 6).map((c) => (
                <FooterLink key={c.slug} href={`/shop?category=${c.slug}`}>
                  {c.name}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title="Rialto">
              {NAV_LINKS.filter((l) => l.href !== "/shop").map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
              <FooterLink href="/cart">Your cart</FooterLink>
            </FooterColumn>

            <FooterColumn title="Showroom">
              <li>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-relaxed text-paper/70 transition-colors hover:text-paper"
                >
                  {SITE_CONFIG.address}
                </a>
              </li>
              {SITE_CONFIG.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={telHref(phone)}
                    className="tabular-nums text-paper/70 transition-colors hover:text-paper"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper/70 transition-colors hover:text-paper"
                >
                  WhatsApp: {SITE_CONFIG.whatsappDisplay}
                </a>
              </li>
            </FooterColumn>

            <FooterColumn title="Follow us">
              {SOCIAL_LINKS.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 text-paper/70 transition-colors hover:text-paper"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full border border-paper/20 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </FooterColumn>
          </div>

          <div className="flex flex-col gap-6 border-t border-paper/10 pt-8 text-xs text-paper/50 md:flex-row md:items-center md:justify-between">
            <Logo tone="light" className="w-[120px] opacity-90" />
            <p>
              © {year} {SITE_CONFIG.name}. Designed for work, made to last.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="transition-colors hover:text-paper">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-paper">
                Terms
              </Link>
            </div>
          </div>
        </div>

        <p
          aria-hidden
          className="pointer-events-none -mb-[0.2em] select-none whitespace-nowrap text-center font-display text-[24vw] leading-[0.8] tracking-[-0.06em] text-paper/[0.04]"
        >
          Rialto
        </p>
      </footer>
    </>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-5 text-[0.7rem] uppercase tracking-[0.2em] text-paper/40">{title}</p>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-paper/70 transition-colors hover:text-paper">
        {children}
      </Link>
    </li>
  );
}
