"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, name: data.get("name"), comment: data.get("comment") }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not post your review.");
      form.reset();
      setRating(5);
      toast.success("Thank you — your review is live.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not post your review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
          Your rating
        </legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(null)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className={cn(
                "text-2xl leading-none transition-colors",
                n <= (hover ?? rating) ? "text-accent" : "text-ink/15",
              )}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <div className="space-y-2">
        <Label htmlFor="review-name">Name</Label>
        <Input id="review-name" name="name" required maxLength={80} autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="review-comment">Your review</Label>
        <Textarea id="review-comment" name="comment" required maxLength={2000} rows={4} />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Posting…" : "Post review"}
      </Button>
    </form>
  );
}
