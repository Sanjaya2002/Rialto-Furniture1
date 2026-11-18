import Link from "next/link";
import Image from "next/image";
import { IMAGERY } from "@/lib/constants";
import { Logo } from "@/components/site/logo";

/** Split-screen frame for admin sign-in / sign-up. */
export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <Image src={IMAGERY.corridor} alt="" fill priority sizes="50vw" className="object-cover opacity-60" />
        <div className="grain absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <p className="absolute bottom-12 left-12 max-w-sm font-display text-4xl leading-tight text-paper">
          Back office for <span className="italic text-accent">Rialto.</span>
        </p>
      </div>
      <div className="flex flex-col px-6 py-10 sm:px-12">
        <Link href="/" aria-label="Back to site" className="self-start">
          <Logo className="w-[124px]" />
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-4xl">{title}</h1>
          <p className="mb-10 mt-2 text-sm text-ink-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
