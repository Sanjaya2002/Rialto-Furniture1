import { Phone } from "lucide-react";
import { PROJECTS } from "@/lib/projects";
import { SITE_CONFIG, telHref, whatsappLink } from "@/lib/constants";
import { SmartImage } from "@/components/site/smart-image";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";

/** Portfolio of completed fit-outs. Renders nothing until projects are added in src/lib/projects.ts. */
export function Projects() {
  if (PROJECTS.length === 0) return null;

  return (
    <section id="projects" className="container scroll-mt-32 py-24 md:py-32">
      <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow mb-5">Our projects</p>
          <SplitText text={"Projects that\n*define* our style"} className="text-display-lg" />
        </div>
        <p className="max-w-md text-ink-muted md:col-span-5 md:justify-self-end">
          Corporate offices, hospitality spaces and institutions across Sri Lanka, furnished and set up by the
          Rialto team.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {PROJECTS.map((project, i) => (
          <Reveal key={`${project.title}-${i}`} delay={(i % 3) * 0.08}>
            <article className="group relative aspect-[4/5] overflow-hidden rounded-md bg-ink text-paper">
              <SmartImage
                src={project.image}
                alt={`${project.title}, ${project.location}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-block rounded-full border border-paper/60 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em]">
                  {project.sector}
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold leading-tight">{project.title}</h3>
                <p className="mt-1 text-sm text-paper/75">{project.location}</p>
                {project.summary && <p className="mt-2 text-sm text-paper/70">{project.summary}</p>}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={whatsappLink("Hi Rialto Furniture, I'd like a quote for furnishing our space.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Get a quote
        </a>
        <a
          href={telHref(SITE_CONFIG.phone)}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-ink/25 px-6 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-paper"
        >
          <Phone className="h-4 w-4" /> Call us today · {SITE_CONFIG.phone}
        </a>
      </div>
    </section>
  );
}
