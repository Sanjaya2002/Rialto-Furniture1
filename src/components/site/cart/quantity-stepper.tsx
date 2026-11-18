"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  size = "md",
  label = "Quantity",
}: QuantityStepperProps) {
  const box = size === "sm" ? "h-9" : "h-12";
  const btn = size === "sm" ? "w-8" : "w-11";

  return (
    <div
      className={cn("inline-flex items-center rounded-sm border border-input bg-card", box)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={cn(
          "grid h-full place-items-center text-ink-soft transition-colors hover:text-ink disabled:opacity-30",
          btn,
        )}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className={cn("min-w-8 text-center text-sm tabular-nums", size === "md" && "min-w-10")}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={cn(
          "grid h-full place-items-center text-ink-soft transition-colors hover:text-ink disabled:opacity-30",
          btn,
        )}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
