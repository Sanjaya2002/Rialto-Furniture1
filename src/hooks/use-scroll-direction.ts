"use client";

import { useState, useEffect } from "react";

export function useScrollDirection() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      setIsScrolled(y > 10);
      setScrollY(y);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { isScrolled, scrollY };
}
