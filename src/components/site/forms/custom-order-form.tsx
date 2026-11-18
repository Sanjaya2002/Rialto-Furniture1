"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FURNITURE_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSuccess } from "./form-status";

const MAX_BYTES = 5 * 1024 * 1024;

export function CustomOrderForm() {
  const [type, setType] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0] ?? null;
    if (next && next.size > MAX_BYTES) {
      toast.error("Please choose a file under 5 MB.");
      e.target.value = "";
      return;
    }
    setFile(next);
  }

  function clearFile() {
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!type) {
      toast.error("Please choose what you’d like us to make.");
      return;
    }
    const form = e.currentTarget;
    const body = new FormData(form);
    body.set("furnitureType", type);
    body.delete("file");
    if (file) body.set("file", file);

    setSubmitting(true);
    try {
      const res = await fetch("/api/custom-orders", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send your request.");
      form.reset();
      setType("");
      clearFile();
      setSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send your request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <FormSuccess
        title="Brief received."
        body="Thank you — we’ll review your requirements and come back with options and a quotation, usually within 48 hours."
        onReset={() => setSent(false)}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <fieldset>
        <legend className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
          What should we make?
        </legend>
        <div className="flex flex-wrap gap-2">
          {FURNITURE_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={cn(
                "h-10 rounded-full border px-5 text-sm transition-colors duration-300",
                type === t ? "border-ink bg-ink text-paper" : "border-input hover:border-ink",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="co-description">Describe the piece</Label>
        <Textarea
          id="co-description"
          name="description"
          required
          rows={5}
          maxLength={5000}
          placeholder="Style, materials, colours, how many, and how the space is used."
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="co-dimensions">Dimensions (optional)</Label>
          <Input id="co-dimensions" name="dimensions" maxLength={200} placeholder="e.g. 180 × 80 × 75 cm" />
        </div>
        <div className="space-y-2">
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
            Reference image / sketch
          </span>
          {file ? (
            <div className="flex h-12 items-center justify-between gap-3 rounded-sm border border-ink bg-card px-3.5 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <Paperclip className="h-4 w-4 shrink-0" />
                <span className="truncate">{file.name}</span>
              </span>
              <button
                type="button"
                onClick={clearFile}
                className="text-ink-muted hover:text-ink"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex h-12 cursor-pointer items-center gap-2 rounded-sm border border-dashed border-input bg-card px-3.5 text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink">
              <Paperclip className="h-4 w-4" />
              Attach JPG, PNG or PDF (max 5 MB)
              <input
                ref={fileInput}
                type="file"
                name="file"
                accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
                onChange={pickFile}
                className="sr-only"
              />
            </label>
          )}
        </div>
      </div>

      <div className="grid gap-6 border-t pt-10 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="co-name">Full name</Label>
          <Input id="co-name" name="customerName" required maxLength={100} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="co-email">Email</Label>
          <Input id="co-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="co-phone">Phone</Label>
          <Input
            id="co-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+94 77 123 4567"
          />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting && <Loader2 className="animate-spin" />}
        {submitting ? "Sending brief…" : "Send my brief"}
      </Button>
    </form>
  );
}
