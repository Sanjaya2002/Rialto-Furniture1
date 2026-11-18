import { cn } from "@/lib/utils";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

/** Shared editorial header for interior pages (sits below the solid navbar). */
export function PageHeader({ eyebrow, title, description, aside, className }: PageHeaderProps) {
  return (
    <header className={cn("container pb-12 pt-32 md:pb-16 md:pt-44", className)}>
      <p className="eyebrow mb-6">{eyebrow}</p>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <SplitText as="h1" immediate delay={0.1} text={title} className="text-display-lg lg:col-span-8" />
        {(description || aside) && (
          <Reveal delay={0.4} className="lg:col-span-4 lg:justify-self-end">
            {description && <div className="max-w-sm text-ink-muted">{description}</div>}
            {aside}
          </Reveal>
        )}
      </div>
    </header>
  );
}
