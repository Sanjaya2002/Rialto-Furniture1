import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { IMAGERY, SITE_CONFIG, mapsHref, telHref } from "@/lib/constants";
import { SplitText } from "@/components/motion/split-text";
import { ScrollText } from "@/components/motion/scroll-text";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our studio",
  description: `The story, approach and values behind ${SITE_CONFIG.name} — office, commercial and educational furniture for Sri Lanka.`,
  alternates: { canonical: "/about" },
};

// TODO(client): confirm wording of vision, mission, strengths and values with Rialto.
const VISION =
  "To be Sri Lanka’s most trusted name in working furniture: known for quality, considered design and the standard of our care after the sale.";

const MISSION =
  "To furnish workplaces, institutions and commercial spaces with pieces that improve comfort and productivity, backed by service people can rely on.";

const VALUES = [
  { title: "Integrity", body: "Honest advice, transparent quotations and promises we keep." },
  { title: "Customer first", body: "Every recommendation starts with how your space is really used." },
  { title: "Excellence", body: "We hold every chair to the standard we would want in our own office." },
  {
    title: "Responsibility",
    body: "Durable furniture, careful delivery and support that lasts beyond the sale.",
  },
];

const STRENGTHS = [
  {
    title: "Premium quality",
    body: "Hand-picked materials and careful construction, so every piece meets the standard we would want in our own office.",
  },
  {
    title: "Delivered and set up",
    body: "Swift, reliable delivery across Sri Lanka, with careful handling and professional setup on site.",
  },
  {
    title: "Made to your brief",
    body: "Bespoke solutions tailored to your requirements, dimensions and the constraints of your space.",
  },
  {
    title: "Service you can trust",
    body: "Dedicated support from the first consultation through to after-sales — until you’re completely satisfied.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-ink text-paper">
        <Image
          src={IMAGERY.lounge}
          alt="A bright lounge furnished with grey sofas, shell chairs and a floor lamp"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="grain absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
        <div className="container relative pb-14 pt-40 md:pb-20">
          <p className="eyebrow mb-6 text-paper/70">The studio</p>
          <SplitText
            as="h1"
            immediate
            delay={0.2}
            text={"Rooms that work\nas *well* as you do"}
            className="max-w-[16ch] text-display-xl [&_.text-accent-deep]:text-accent"
          />
        </div>
      </section>

      <section className="container py-24 md:py-36">
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3 lg:pt-4">Our story</p>
          <ScrollText
            className="font-display text-display-sm leading-[1.2] lg:col-span-9"
            text={`${SITE_CONFIG.name} was born from a vision to transform spaces across Sri Lanka with furniture that pairs timeless design with *uncompromising* quality. What began as a small workshop has grown into a trusted name for office, commercial and educational furniture.`}
          />
        </div>
      </section>

      <section className="container grid gap-10 pb-24 md:grid-cols-12 md:pb-36">
        <ParallaxImage
          src={IMAGERY.workspace}
          alt="A white desk and chairs beside a wall of windows"
          sizes="(min-width: 768px) 58vw, 100vw"
          className="aspect-[4/3] md:col-span-7"
        />
        <div className="flex flex-col justify-end gap-10 md:col-span-4 md:col-start-9">
          <Reveal>
            <p className="eyebrow mb-4">Our vision</p>
            <p className="font-display text-2xl font-semibold leading-snug">{VISION}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow mb-4">Our mission</p>
            <p className="text-lg leading-relaxed text-ink-soft">{MISSION}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-bone py-24 md:py-36">
        <div className="container">
          <div className="mb-16 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="eyebrow mb-5">Core strengths</p>
              <SplitText text={"What we do\n*best*"} className="text-display-lg" />
            </div>
          </div>
          <RevealGroup className="grid border-t md:grid-cols-2">
            {STRENGTHS.map((p, i) => (
              <RevealItem
                key={p.title}
                className="grid grid-cols-[3rem_1fr] gap-4 border-b py-10 md:odd:border-r md:odd:pr-10 md:even:pl-10"
              >
                <span className="text-xs tabular-nums text-accent-deep">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl leading-tight">{p.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-ink-muted">{p.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="container py-24 md:py-36">
        <div className="mb-14 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow mb-5">Our values</p>
            <SplitText text={"What we *stand* for"} className="text-display-lg" />
          </div>
        </div>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {VALUES.map((value, i) => (
            <RevealItem key={value.title} className="rounded-md border bg-card p-7">
              <span className="text-xs font-semibold tabular-nums text-accent-deep">0{i + 1}</span>
              <h3 className="mt-6 font-display text-2xl font-bold">{value.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">{value.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="container grid gap-12 border-t py-24 md:grid-cols-12 md:py-36">
        <div className="md:col-span-6">
          <SplitText text={"Visit the\n*showroom*"} className="text-display-lg" />
          <p className="mt-8 max-w-md leading-relaxed text-ink-muted">
            Sit in it before you specify it. Our team can walk you through finishes, mechanisms and layouts
            for your space.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Plan a visit</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">Browse online</Link>
            </Button>
          </div>
        </div>
        <dl className="grid content-end gap-8 border-t pt-8 text-sm md:col-span-5 md:col-start-8">
          <div>
            <dt className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Address</dt>
            <dd className="text-lg">
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="link-underline">
                {SITE_CONFIG.address}
              </a>
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Phone</dt>
            {SITE_CONFIG.phones.map((phone) => (
              <dd key={phone} className="text-lg tabular-nums">
                <a href={telHref(phone)} className="link-underline">
                  {phone}
                </a>
              </dd>
            ))}
          </div>
          <div>
            <dt className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Email</dt>
            {SITE_CONFIG.emails.map((email) => (
              <dd key={email.address} className="text-lg">
                <a href={`mailto:${email.address}`} className="link-underline">
                  {email.address}
                </a>
              </dd>
            ))}
          </div>
        </dl>
      </section>
    </>
  );
}
