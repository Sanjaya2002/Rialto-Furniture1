import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG, SOCIAL_LINKS, whatsappLink } from "@/lib/constants";
import { Logo } from "@/components/site/logo";
import { SplitText } from "@/components/motion/split-text";

interface FooterProps {
  categories: { name: string; slug: string }[];
}

export function Footer({ categories }: FooterProps) {
  const year = new Date().getFullYear();

  return (
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
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="group flex w-full items-center justify-between border-b border-paper/20 py-4 text-lg transition-colors hover:border-accent lg:max-w-sm"
            >
              {SITE_CONFIG.email}
              <ArrowUpRight className="h-5 w-5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 text-sm md:grid-cols-4">
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
            <li className="leading-relaxed text-paper/70">{SITE_CONFIG.address}</li>
            <li>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                className="text-paper/70 transition-colors hover:text-paper"
              >
                {SITE_CONFIG.phone}
              </a>
            </li>
          </FooterColumn>

          <FooterColumn title="Follow">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper/70 transition-colors hover:text-paper"
                >
                  {s.label}
                </a>
              </li>
            ))}
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
