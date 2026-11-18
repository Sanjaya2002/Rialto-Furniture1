import Link from "next/link";
import { IMAGERY } from "@/lib/constants";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { SplitText } from "@/components/motion/split-text";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

const STEPS = [
  { title: "Brief", body: "Share the room, the headcount and how it’s used. Sketches and photos help." },
  {
    title: "Proposal",
    body: "We come back with options, finishes and a clear quotation — usually within 48 hours.",
  },
  {
    title: "Make & install",
    body: "Your pieces are produced, delivered and set up by our team, anywhere on the island.",
  },
];

export function MadeToMeasure() {
  return (
    <section className="bg-ink py-24 text-paper md:py-36">
      <div className="container grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6">
          <ParallaxImage
            src={IMAGERY.craft}
            alt="A simple timber stool against a pale blue wall"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-[4/5] w-full lg:w-[88%]"
          />
          <Reveal delay={0.3} className="absolute -bottom-8 right-0 hidden w-[44%] lg:block">
            <ParallaxImage
              src={IMAGERY.detail}
              alt="A curved plywood lounge chair beside a palm"
              sizes="20vw"
              strength={8}
              className="aspect-square w-full border-[10px] border-ink"
            />
          </Reveal>
        </div>

        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <p className="eyebrow mb-6 text-paper/50">04 — Made to measure</p>
          <SplitText
            text={"When the catalogue\nisn’t *quite* right"}
            className="text-display-md [&_.text-accent-deep]:text-accent"
          />
          <p className="mt-8 max-w-md leading-relaxed text-paper/70">
            Odd-shaped rooms, brand colours, a reception desk that has to seat four — we make furniture to
            your dimensions and finish, then fit it on site.
          </p>

          <RevealGroup className="mt-12 divide-y divide-paper/10 border-y border-paper/10">
            {STEPS.map((step, i) => (
              <RevealItem key={step.title} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                <span className="text-xs tabular-nums text-accent">0{i + 1}</span>
                <div>
                  <h3 className="font-sans text-base font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-paper/60">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-10">
            <Button asChild variant="light" size="lg">
              <Link href="/custom-order">Start a custom order</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
