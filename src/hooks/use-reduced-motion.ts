"use client";

import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    function handler(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches);
    }

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}
