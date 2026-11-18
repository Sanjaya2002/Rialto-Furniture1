import type { Metadata } from "next";
import { IMAGERY, SITE_CONFIG } from "@/lib/constants";
import { PageHeader } from "@/components/site/page-header";
import { CustomOrderForm } from "@/components/site/forms/custom-order-form";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Custom furniture",
  description: `Commission made-to-measure furniture from ${SITE_CONFIG.name} — your dimensions, materials and finish, delivered and installed across Sri Lanka.`,
  alternates: { canonical: "/custom-order" },
};

const STEPS = [
  {
    title: "Tell us your idea",
    body: "Share requirements, dimensions and any reference images or sketches.",
  },
  {
    title: "Get a quotation",
    body: "We review your brief and send a detailed quote, usually within 48 hours.",
  },
  { title: "We make it", body: "Once approved, your piece is crafted with premium materials." },
  { title: "Delivery & setup", body: "We deliver and install at your location, anywhere in Sri Lanka." },
];

export default function CustomOrderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Made to measure"
        title={"Built to your\n*brief*"}
        description="When the catalogue isn’t quite right, we make it — to your dimensions, materials and finish."
      />

      <section className="container grid gap-16 border-t pb-24 pt-12 md:pb-36 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <ParallaxImage
            src={IMAGERY.craft}
            alt="A simple timber stool against a pale blue wall"
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="mb-12 hidden aspect-[4/5] lg:block"
          />
          <p className="eyebrow mb-6">How it works</p>
          <RevealGroup className="divide-y border-y">
            {STEPS.map((step, i) => (
              <RevealItem key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-3 py-5">
                <span className="text-xs tabular-nums text-accent-deep">0{i + 1}</span>
                <div>
                  <h3 className="font-sans text-[0.95rem] font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </aside>

        <div className="lg:col-span-7 lg:col-start-6">
          <CustomOrderForm />
        </div>
      </section>
    </>
  );
}
