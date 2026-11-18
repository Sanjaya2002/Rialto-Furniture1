"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Link2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmartImage } from "@/components/site/smart-image";
import { apiRequest, errorMessage } from "@/lib/api-client";

const MAX_SIDE = 2000;
const QUALITY = 0.85;

/**
 * Downscales to MAX_SIDE and re-encodes as WebP in the browser, so uploads stay small
 * (well under the 4.5 MB request limit) and storage lasts longer. Falls back to the original
 * file if the browser can't decode it.
 */
async function compress(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  /** Maximum number of images (1 for a single cover image). */
  max?: number;
  folder?: "products" | "categories" | "projects";
}

export function ImageUploader({ value, onChange, max = 8, folder = "products" }: ImageUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [url, setUrl] = useState("");
  const remaining = max - value.length;

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const selected = Array.from(files).slice(0, Math.max(0, remaining));
    if (selected.length < files.length) toast.message(`Only ${max} image${max === 1 ? "" : "s"} allowed.`);

    setUploading(selected.length);
    const uploaded: string[] = [];
    for (const file of selected) {
      try {
        const body = new FormData();
        body.append("file", await compress(file));
        body.append("folder", folder);
        const { url } = await apiRequest<{ url: string }>("/api/admin/uploads", { method: "POST", body });
        uploaded.push(url);
      } catch (error) {
        toast.error(`${file.name}: ${errorMessage(error, "upload failed")}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (uploaded.length) {
      onChange(max === 1 ? uploaded.slice(0, 1) : [...value, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded`);
    }
    if (input.current) input.current.value = "";
  }

  function addUrl() {
    const trimmed = url.trim();
    try {
      if (new URL(trimmed).protocol !== "https:") throw new Error();
    } catch {
      toast.error("Enter a full https:// image link.");
      return;
    }
    onChange(max === 1 ? [trimmed] : [...value, trimmed]);
    setUrl("");
  }

  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const makeFirst = (i: number) => onChange([value[i], ...value.filter((_, j) => j !== i)]);

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((src, i) => (
            <li
              key={`${src}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-sm bg-bone"
            >
              <SmartImage src={src} alt="" fill sizes="120px" className="object-cover" />
              {i === 0 && max > 1 && (
                <span className="absolute left-1.5 top-1.5 rounded-sm bg-ink px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-paper">
                  Main
                </span>
              )}
              <div className="absolute right-1.5 top-1.5 flex gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => makeFirst(i)}
                    className="grid h-6 w-6 place-items-center rounded-full bg-paper/90 text-ink shadow hover:bg-paper"
                    aria-label="Make main image"
                    title="Make main image"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="grid h-6 w-6 place-items-center rounded-full bg-paper/90 text-ink shadow hover:bg-destructive hover:text-white"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={max > 1}
        className="hidden"
        onChange={(e) => upload(e.target.files)}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => input.current?.click()}
          disabled={uploading > 0 || (max > 1 && remaining <= 0)}
        >
          {uploading > 0 ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          {uploading > 0
            ? `Uploading ${uploading}…`
            : max === 1 && value.length
              ? "Replace image"
              : "Upload images"}
        </Button>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="…or paste an image link (https://)"
            className="border-border bg-card pl-8 text-sm text-ink placeholder:text-ink-muted/60"
          />
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={addUrl} disabled={!url.trim()}>
          Add
        </Button>
      </div>
      <p className="text-xs text-ink-muted">
        JPG, PNG or WebP. Photos are resized to 2000px and compressed automatically.
        {max > 1 && " The first image is the main photo."}
      </p>
    </div>
  );
}
