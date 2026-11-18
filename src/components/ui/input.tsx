import * as React from "react";
import { cn } from "@/lib/utils";

export const fieldClass =
  "flex w-full rounded-sm border border-input bg-card px-3.5 text-[0.95rem] text-ink transition-colors placeholder:text-ink-muted/70 hover:border-ink/40 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        fieldClass,
        "h-12 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
