import { ScrollText } from "@/components/motion/scroll-text";
import { Counter } from "@/components/motion/counter";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

interface IntroProps {
  productCount: number;
  categoryCount: number;
}

export function Intro({ productCount, categoryCount }: IntroProps) {
  const stats = [
    productCount > 0 && { value: <Counter to={productCount} />, label: "Pieces in the collection" },
    categoryCount > 0 && { value: <Counter to={categoryCount} />, label: "Ranges for every room" },
    { value: <Counter to={48} suffix="h" />, label: "Typical quotation turnaround" },
    {
      value: <span className="whitespace-nowrap text-[0.8em]">All‑island</span>,
      label: "Delivery and on-site setup",
    },
  ].filter(Boolean) as { value: React.ReactNode; label: string }[];

  return (
    <section className="container py-24 md:py-36">
      <div className="grid gap-10 lg:grid-cols-12">
        <p className="eyebrow lg:col-span-3 lg:pt-4">01 — The studio</p>
        <ScrollText
          className="font-display text-display-sm leading-[1.18] lg:col-span-9 lg:text-[clamp(2rem,3.3vw,3.4rem)]"
          text="We furnish the places where people spend their working day — boardrooms, receptions, classrooms and studios. Every chair is chosen for *posture,* every desk for *patience,* and every space is set up by our team, so it arrives finished rather than just delivered."
        />
      </div>

      <RevealGroup className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t pt-10 md:mt-28 lg:grid-cols-4">
        {stats.map((s) => (
          <RevealItem key={s.label}>
            <p className="font-display text-[clamp(2.4rem,4.5vw,4rem)] tabular-nums leading-none">
              {s.value}
            </p>
            <p className="mt-3 text-sm text-ink-muted">{s.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
