import Link from "next/link";
import { IMAGERY } from "@/lib/constants";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";
import { Marquee } from "@/components/motion/marquee";

const SPACES = [
  {
    title: "Workspaces",
    body: "Task chairs and desks that hold posture through an eight-hour day.",
    image: IMAGERY.workspace,
    alt: "A white desk with a laptop beside floor-to-ceiling windows",
    href: "/shop?category=office-chairs",
  },
  {
    title: "Receptions & lounges",
    body: "First impressions that are comfortable to wait in.",
    image: IMAGERY.lounge,
    alt: "A bright lounge with grey sofas, shell chairs and a black floor lamp",
    href: "/shop?category=reception-chairs",
  },
  {
    title: "Learning spaces",
    body: "Hard-wearing seating for lecture halls and training rooms.",
    image: IMAGERY.corridor,
    alt: "A long, calm office corridor with built-in storage",
    href: "/shop?category=lecture-chairs",
  },
];

const VALUES = [
  "Ergonomic by design",
  "All-island delivery",
  "On-site setup",
  "Made-to-measure options",
  "After-sales care",
  "Built for daily use",
] as const;

export function Spaces({ categorySlugs }: { categorySlugs: string[] }) {
  const available = new Set(categorySlugs);
  const linkFor = (href: string) => {
    const slug = new URLSearchParams(href.split("?")[1]).get("category");
    return slug && available.has(slug) ? href : "/shop";
  };

  return (
    <section className="overflow-hidden py-24 md:py-36">
      <div className="container">
        <div className="mb-14 max-w-3xl md:mb-20">
          <p className="eyebrow mb-5">05 — Where it lives</p>
          <SplitText text={"Designed around\nhow rooms are *used*"} className="text-display-lg" />
        </div>

        <div className="grid gap-12 md:grid-cols-3 md:gap-6">
          {SPACES.map((space, i) => (
            <Reveal key={space.title} delay={i * 0.1} className={i === 1 ? "md:mt-24" : undefined}>
              <Link href={linkFor(space.href)} className="group block">
                <ParallaxImage
                  src={space.image}
                  alt={space.alt}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="aspect-[3/4]"
                />
                <div className="mt-5 flex items-baseline justify-between gap-4 border-b pb-5">
                  <h3 className="font-display text-[1.75rem] leading-tight transition-colors group-hover:text-accent-deep">
                    {space.title}
                  </h3>
                  <span className="text-xs tabular-nums text-ink-muted">0{i + 1}</span>
                </div>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">{space.body}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <Marquee
        items={VALUES}
        className="mt-24 border-y py-6 font-display text-[clamp(1.6rem,3vw,2.6rem)] italic text-ink md:mt-36"
      />
    </section>
  );
}
