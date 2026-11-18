"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/constants";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[80vh] flex-col justify-center pb-24 pt-32">
      <p className="eyebrow mb-6">Something went wrong</p>
      <h1 className="text-display-lg">
        We hit a <span className="italic text-accent-deep">snag.</span>
      </h1>
      <p className="mt-8 max-w-md text-ink-muted">
        This page didn’t load properly. Try again in a moment — or message us and we’ll help directly.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            Message us
          </a>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
