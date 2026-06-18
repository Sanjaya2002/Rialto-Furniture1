"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6 inline-flex items-center justify-center">
          <div className="rounded-full bg-green-50 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black mb-3">
          Order Confirmed!
        </h1>

        <p className="text-muted-foreground text-lg mb-2">
          Thank you for your purchase.
        </p>
        <p className="text-muted-foreground mb-8">
          Your order has been placed successfully and is being processed.
        </p>

        {orderId && (
          <div className="inline-flex items-center gap-2 rounded-lg border border-luxury-gold/30 bg-gold-light/5 px-6 py-3 mb-8">
            <Package className="h-5 w-5 text-luxury-gold" />
            <span className="text-sm font-medium text-luxury-black">
              Order ID: #{orderId}
            </span>
          </div>
        )}

        <Separator className="mb-8" />

        <p className="text-sm text-muted-foreground mb-8">
          A confirmation email has been sent to your email address.
          <br />
          You will receive a notification once your order is shipped.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28 px-4 text-center">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
