import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/motion/split-text";

export default function NotFound() {
  return (
    <div className="container flex min-h-[80vh] flex-col justify-center pb-24 pt-32">
      <p className="eyebrow mb-6">404</p>
      <SplitText as="h1" immediate text={"This seat is\n*empty.*"} className="text-display-xl" />
      <p className="mt-8 max-w-md text-ink-muted">
        The page you’re looking for has moved or no longer exists. Let’s get you somewhere comfortable.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/shop">Browse the collection</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
