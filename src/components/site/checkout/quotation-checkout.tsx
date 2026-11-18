"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { formatPrice } from "@/lib/utils";
import { IMAGERY } from "@/lib/constants";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/components/site/smart-image";
import { SplitText } from "@/components/motion/split-text";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

const EMPTY: ContactForm = { name: "", email: "", phone: "", address: "", notes: "" };
const DRAFT_KEY = "rialto-quotation-draft";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function QuotationCheckout() {
  const router = useRouter();
  const { items, hydrated, totalPrice, totalItems, clearCart } = useCart();
  const [session, setSession] = useState<Session | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const idempotencyKey = useRef<string | null>(null);

  // Session + restore any draft saved before the Google redirect.
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem(DRAFT_KEY);
      if (draft) setForm({ ...EMPTY, ...JSON.parse(draft) });
    } catch {
      /* ignore malformed draft */
    }

    let supabase: ReturnType<typeof getBrowserSupabase>;
    try {
      supabase = getBrowserSupabase();
    } catch {
      setAuthStatus("unauthenticated");
      return;
    }

    let active = true;
    const apply = (next: Session | null) => {
      if (!active) return;
      setSession(next);
      setAuthStatus(next ? "authenticated" : "unauthenticated");
      if (next?.user) {
        const meta = next.user.user_metadata ?? {};
        setForm((f) => ({
          ...f,
          name: f.name || (typeof meta.full_name === "string" ? meta.full_name : ""),
          email: f.email || next.user.email || "",
        }));
      }
    };

    supabase.auth.getSession().then(({ data }) => apply(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => apply(next));
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  const set = (field: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function signIn() {
    setRedirecting(true);
    try {
      const { error } = await getBrowserSupabase().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/checkout` },
      });
      if (error) throw error;
    } catch {
      setRedirecting(false);
      toast.error("Google sign-in failed. Please try again.");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return signIn();
    if (items.length === 0) return;

    setSubmitting(true);
    idempotencyKey.current ??= crypto.randomUUID();

    try {
      const res = await fetch("/api/quotation-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          address: form.address,
          notes: form.notes,
          idempotencyKey: idempotencyKey.current,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");

      sessionStorage.removeItem(DRAFT_KEY);
      clearCart();
      router.push(`/quotation-success?ref=${encodeURIComponent(data.reference)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (hydrated && items.length === 0 && !submitting) {
    return (
      <div className="container pb-24 pt-32 md:pt-44">
        <p className="eyebrow mb-6">Quotation</p>
        <h1 className="text-display-md">Your cart is empty.</h1>
        <p className="mt-4 max-w-md text-ink-muted">
          Add a few pieces first and we’ll quote for the whole space.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/shop">Explore the collection</Link>
        </Button>
      </div>
    );
  }

  const signedIn = authStatus === "authenticated";

  return (
    <div className="container pb-24 pt-32 md:pb-36 md:pt-44">
      <Link href="/cart" className="link-underline mb-10 !block w-fit text-sm text-ink-muted">
        ← Back to cart
      </Link>
      <p className="eyebrow mb-6">No payment required</p>
      <SplitText as="h1" immediate text={"Request a\n*quotation*"} className="text-display-lg" />

      <form onSubmit={submit} className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Step n={1} title="Verify it’s you" done={signedIn}>
            {authStatus === "loading" ? (
              <Skeleton className="h-12 w-64" />
            ) : signedIn ? (
              <p className="flex items-center gap-2 text-sm text-ink-soft">
                <Check className="h-4 w-4 text-success" />
                Signed in as <span className="font-medium text-ink">{session?.user.email}</span>
              </p>
            ) : (
              <div>
                <p className="mb-5 max-w-md text-sm text-ink-muted">
                  We ask you to sign in with Google so we can send your quotation securely. Your cart and
                  details stay right here.
                </p>
                <Button type="button" variant="outline" size="lg" onClick={signIn} disabled={redirecting}>
                  {redirecting ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
                  {redirecting ? "Redirecting…" : "Continue with Google"}
                </Button>
              </div>
            )}
          </Step>

          <Step n={2} title="Where should we send it?">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" id="name">
                <Input id="name" value={form.name} onChange={set("name")} required autoComplete="name" />
              </Field>
              <Field label="Phone" id="phone">
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  required
                  autoComplete="tel"
                  placeholder="+94 77 123 4567"
                />
              </Field>
              <Field label="Email" id="email" className="sm:col-span-2">
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                  autoComplete="email"
                />
              </Field>
              <Field label="Delivery address" id="address" className="sm:col-span-2">
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={set("address")}
                  required
                  rows={3}
                  autoComplete="street-address"
                />
              </Field>
              <Field label="Notes (optional)" id="notes" className="sm:col-span-2">
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={set("notes")}
                  rows={3}
                  placeholder="Timelines, finishes, number of workstations, site access…"
                />
              </Field>
            </div>
          </Step>
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-card p-6 md:p-8 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">
              Your selection <span className="font-sans text-sm text-ink-muted">({totalItems})</span>
            </h2>
            <ul className="mt-6 max-h-[40vh] divide-y overflow-y-auto border-y" data-lenis-prevent>
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4">
                  <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-bone">
                    <SmartImage
                      src={item.image || IMAGERY.productFallback}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs tabular-nums text-ink-muted">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between py-6">
              <span>Estimated total</span>
              <span className="font-display text-3xl tabular-nums">{formatPrice(totalPrice)}</span>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={submitting || authStatus === "loading" || redirecting}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" /> Sending request…
                </>
              ) : signedIn ? (
                "Send quotation request"
              ) : (
                "Sign in & send request"
              )}
            </Button>
            <p className="mt-4 text-xs leading-relaxed text-ink-muted">
              Nothing is charged. You’ll receive a written quotation with final pricing, delivery and setup
              details.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Step({
  n,
  title,
  done,
  children,
}: {
  n: number;
  title: string;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t pb-12 pt-8">
      <div className="mb-6 flex items-center gap-4">
        <span
          className={
            done
              ? "grid h-7 w-7 place-items-center rounded-full bg-ink text-paper"
              : "grid h-7 w-7 place-items-center rounded-full border border-ink/30 text-xs tabular-nums"
          }
        >
          {done ? <Check className="h-3.5 w-3.5" /> : n}
        </span>
        <h2 className="font-display text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  id,
  className,
  children,
}: {
  label: string;
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 block">
        {label}
      </Label>
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
