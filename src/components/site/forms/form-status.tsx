"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/components/motion/easing";

/** Confirmation panel shown in place of a form after a successful submit. */
export function FormSuccess({ title, body, onReset }: { title: string; body: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      className="flex flex-col items-start gap-5 border-t pt-10"
      role="status"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-paper">
        <Check className="h-5 w-5" />
      </span>
      <h3 className="font-display text-3xl">{title}</h3>
      <p className="max-w-md text-ink-muted">{body}</p>
      <Button type="button" variant="outline" onClick={onReset}>
        Send another
      </Button>
    </motion.div>
  );
}
