import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Quotation request received",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ ref?: string }> };

export default async function QuotationSuccessPage({ searchParams }: Props) {
  const raw = (await searchParams).ref ?? "";
  const reference = /^RQ-[A-Z0-9]{4,10}$/.test(raw) ? raw : null;

  return (
    <div className="container flex min-h-[80vh] flex-col justify-center pb-24 pt-32 md:pt-44">
      <p className="eyebrow mb-6">Request received</p>
      <SplitText as="h1" immediate text={"Thank you —\nwe’re on *it.*"} className="text-display-lg" />

      <Reveal delay={0.5} className="mt-12 grid gap-10 border-t pt-10 md:grid-cols-12">
        <div className="md:col-span-5">
          {reference && (
            <>
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Your reference</p>
              <p className="mt-2 font-display text-4xl tracking-wide">{reference}</p>
            </>
          )}
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ol className="space-y-5 text-ink-soft">
            <li className="flex gap-4">
              <span className="text-xs tabular-nums text-accent-deep">01</span>
              Our team reviews your selection and checks availability and lead times.
            </li>
            <li className="flex gap-4">
              <span className="text-xs tabular-nums text-accent-deep">02</span>
              You receive a written quotation — usually within 48 hours — including delivery and setup.
            </li>
            <li className="flex gap-4">
              <span className="text-xs tabular-nums text-accent-deep">03</span>
              Nothing is charged until you approve it.
            </li>
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/shop">Keep browsing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href={whatsappLink(
                  reference ? `Hi Rialto, following up on quotation ${reference}.` : undefined,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow up on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
