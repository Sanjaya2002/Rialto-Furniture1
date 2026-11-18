"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, pad } from "@/lib/utils";
import { SmartImage } from "@/components/site/smart-image";
import { EASE_OUT } from "@/components/motion/easing";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const onRailScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    setActive(Math.round(rail.scrollLeft / rail.clientWidth));
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div>
      {/* Mobile: swipe */}
      <div className="relative -mx-5 sm:-mx-6 md:hidden">
        <div
          ref={railRef}
          onScroll={onRailScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((src, i) => (
            <div key={src + i} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-bone">
              <SmartImage
                src={src}
                alt={i === 0 ? name : `${name} — view ${i + 1}`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-4 left-5 rounded-full bg-paper/90 px-3 py-1 text-xs tabular-nums backdrop-blur">
            {pad(active + 1)} / {pad(images.length)}
          </div>
        )}
      </div>

      {/* Desktop: thumbnails + zoomable stage */}
      <div className="hidden gap-4 md:grid md:grid-cols-[72px_1fr]">
        <div className="flex flex-col gap-3">
          {images.length > 1 &&
            images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative aspect-[4/5] overflow-hidden bg-bone transition-opacity duration-300",
                  i === active
                    ? "opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-paper"
                    : "opacity-50 hover:opacity-90",
                )}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
              >
                <SmartImage src={src} alt="" fill sizes="72px" className="object-cover" />
              </button>
            ))}
        </div>

        <div
          className="relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-bone"
          onMouseMove={onMove}
          onMouseLeave={() => setZoom(null)}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <SmartImage
                src={images[active]}
                alt={name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="object-cover transition-transform duration-300 ease-out"
                style={
                  zoom
                    ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : { transform: "scale(1)" }
                }
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
