import { cn } from "@/lib/utils";

/** Infinite horizontal ticker (pure CSS, pauses on hover). */
export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="px-6 md:px-10">{item}</span>
          <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
