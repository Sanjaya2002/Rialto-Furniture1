import { cn } from "@/lib/utils";

export function RialtoBrand({ className }: { className?: string }) {
  return (
    <span className={cn("inline", className)}>
      <span className="text-brand-orange">R</span>
      <span className="text-brand-navy">ialto</span>
    </span>
  );
}
