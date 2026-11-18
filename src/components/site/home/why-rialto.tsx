import { Gem, Headset, PencilRuler, Truck } from "lucide-react";
import { SplitText } from "@/components/motion/split-text";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

const BENEFITS = [
  { icon: Gem, title: "Quality", body: "Premium materials and careful craftsmanship in every chair." },
  { icon: Truck, title: "Delivery", body: "Reliable delivery and setup anywhere across Sri Lanka." },
  {
    icon: PencilRuler,
    title: "Custom",
    body: "Furniture tailored to your requirements, sizes and finishes.",
  },
  { icon: Headset, title: "Support", body: "With you from the first consultation to after-sales care." },
];

export function WhyRialto() {
  return (
    <section className="bg-bone py-24 md:py-32" aria-labelledby="why-rialto">
      <div className="container">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow mb-5">04 — Why Rialto?</p>
            <SplitText text={"Built on four\n*promises*"} className="text-display-lg" />
            <span id="why-rialto" className="sr-only">
              Why Rialto
            </span>
          </div>
          <p className="max-w-sm text-ink-muted md:col-span-4 md:justify-self-end">
            Four promises behind every chair we supply, from the first quotation to years of daily use.
          </p>
        </div>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {BENEFITS.map(({ icon: Icon, title, body }, i) => (
            <RevealItem
              key={title}
              className="group relative flex flex-col overflow-hidden rounded-md bg-card p-7 shadow-[0_1px_0_rgba(15,34,53,0.06)] transition-colors duration-500 hover:bg-ink hover:text-paper md:p-8"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent-deep transition-colors duration-500 group-hover:bg-accent group-hover:text-ink">
                <Icon className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <h3 className="mt-8 font-display text-2xl font-bold">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted transition-colors duration-500 group-hover:text-paper/70">
                {body}
              </p>
              <span className="absolute right-6 top-6 text-xs font-semibold tabular-nums text-ink/25 transition-colors duration-500 group-hover:text-paper/40">
                0{i + 1}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
