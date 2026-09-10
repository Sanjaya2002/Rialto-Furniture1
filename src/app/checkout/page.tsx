"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";
import { toast } from "sonner";
import { ShoppingBag, ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_METHODS, PAYMENTS_ENABLED } from "@/lib/constants";
import { getPayHereCheckoutUrl, getPayHereFormFields } from "@/lib/payhere";
import { initiateKOKOPayment, getKOKOPaymentUrl } from "@/lib/koko";
import OrderSummary from "@/components/checkout/order-summary";
import { fadeUp, staggerContainer, staggerItemFast } from "@/lib/animations";

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M21.35 11.1H12v3.6h5.4c-.5 2.3-2.4 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 4 1.5l2.7-2.7C16.8 3.4 14.5 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.9-.1-1.5-.25-2.1z"
        fill="#4285F4"
      />
      <path
        d="M6.3 7.6l2.9 2.1c.9-2.6 3.1-4.3 5.8-4.3 1.5 0 2.9.6 4 1.5l2.7-2.7C19.8 2.4 16.5 1 13 1 8.8 1 5.2 3.4 3.4 6.7l2.9.9z"
        fill="#EA4335"
      />
      <path
        d="M12 19c-2.4 0-4.5-1.3-5.7-3.2l-2.9 2.2C5.6 20.9 8.8 22.5 12 22.5c3.4 0 6.7-1.4 8.9-3.8l-2.9-2.3c-1 1.4-3.3 2.6-6 2.6z"
        fill="#34A853"
      />
      <path
        d="M6.3 16.4c-.5-1-.8-2.1-.8-3.4 0-1.3.3-2.4.8-3.4l-3-2.2C2.3 8.6 1.6 10.3 1.6 12s.6 3.4 1.5 4.6l3.2-1.2z"
        fill="#FBBC04"
      />
    </svg>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [authRedirecting, setAuthRedirecting] = useState(false);
  const idempotencyKeyRef = useRef<string | null>(null);

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const supabase = getSupabaseClient();
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthStatus(data.session ? "authenticated" : "unauthenticated");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setAuthStatus(newSession ? "authenticated" : "unauthenticated");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthRedirecting(true);
    try {
      const { error } = await getSupabaseClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/checkout` },
      });
      if (error) throw error;
    } catch {
      setAuthRedirecting(false);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const handleQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Please fill in all fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = crypto.randomUUID();
      }

      const token = (
        await getSupabaseClient().auth.getSession()
      ).data.session?.access_token;

      const res = await fetch("/api/quotation-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          address: form.address,
          notes: form.notes,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      clearCart();
      toast.success("Quotation request submitted successfully!");
      router.push(`/quotation-success?ref=${data.reference}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Please fill in all fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        address: form.address,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        totalPrice,
        paymentMethod,
      };

      if (paymentMethod === "cod") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!res.ok) throw new Error("Failed to place order");

        const order = await res.json();
        clearCart();
        toast.success("Order placed successfully!");
        router.push(`/order-confirmation?id=${order.id}`);
      } else if (paymentMethod === "payhere") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!res.ok) throw new Error("Failed to create order");

        const order = await res.json();
        const fields = getPayHereFormFields({
          merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || "",
          merchant_secret: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET || "",
          amount: totalPrice,
          order_id: order.id,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          return_url: `${window.location.origin}/order-confirmation?id=${order.id}`,
          cancel_url: `${window.location.origin}/checkout`,
          notify_url: `${window.location.origin}/api/payhere/notify`,
        });

        const formElement = document.createElement("form");
        formElement.method = "POST";
        formElement.action = getPayHereCheckoutUrl();

        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          formElement.appendChild(input);
        });

        document.body.appendChild(formElement);
        formElement.submit();
      } else if (paymentMethod === "koko") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!res.ok) throw new Error("Failed to create order");

        const order = await res.json();
        const payment = await initiateKOKOPayment({
          apiKey: process.env.NEXT_PUBLIC_KOKO_API_KEY || "",
          amount: totalPrice,
          orderId: order.id,
          customerEmail: form.email,
          customerPhone: form.phone,
        });

        if (payment?.paymentId) {
          window.location.href = getKOKOPaymentUrl(payment.paymentId);
        } else {
          throw new Error("Failed to initiate payment");
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = PAYMENTS_ENABLED ? handlePaymentSubmit : handleQuotationSubmit;

  if (items.length === 0) {
    return (
      <motion.div
        className="min-h-screen pt-28 pb-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mb-6 rounded-full bg-luxury-gray p-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </motion.div>
            <h1 className="text-2xl font-serif font-bold text-luxury-black mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Add some items before checking out.
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const isAuthenticated = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

  return (
    <motion.div
      className="min-h-screen pt-28 pb-16 px-4"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-8" variants={fadeUp}>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-luxury-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black mt-2">
            {PAYMENTS_ENABLED ? "Checkout" : "Request a Quotation"}
          </h1>
          {!PAYMENTS_ENABLED && (
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Submit your cart and our team will prepare a personalised quotation.
              No payment is required at this stage.
            </p>
          )}
        </motion.div>

        {!PAYMENTS_ENABLED && !isAuthenticated && (
          <motion.div variants={fadeUp} className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 rounded-full bg-gold-light/5 p-3">
                      <ShieldCheck className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-luxury-black">
                        Sign in to request your quotation
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your cart will be kept safe while you sign in with Google.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={isAuthLoading || authRedirecting}
                    className="gap-2 shrink-0"
                  >
                    <GoogleIcon className="h-4 w-4" />
                    {authRedirecting
                      ? "Redirecting to Google..."
                      : "Continue with Google"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              className="lg:col-span-2 space-y-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={staggerItemFast}>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-luxury-black">
                        Contact Information
                      </h2>
                      {isAuthenticated && (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-gold">
                          <ShieldCheck className="h-4 w-4" />
                          Signed in
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Customer Name</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="+94 77 123 4567"
                          required
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={form.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          placeholder="123 Main Street, Colombo 03"
                          rows={3}
                          required
                        />
                      </div>
                      {!PAYMENTS_ENABLED && (
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            value={form.notes}
                            onChange={(e) => updateField("notes", e.target.value)}
                            placeholder="Delivery instructions, customisation requests, etc."
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {PAYMENTS_ENABLED && (
                <motion.div variants={staggerItemFast}>
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-lg font-semibold text-luxury-black">
                        Payment Method
                      </h2>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="grid grid-cols-1 gap-3"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <motion.label
                            key={method.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`flex items-start gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                              paymentMethod === method.id
                                ? "border-luxury-gold bg-gold-light/5"
                                : "border-input hover:border-muted-foreground"
                            }`}
                          >
                            <RadioGroupItem
                              value={method.id}
                              id={method.id}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-luxury-black">
                                {method.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {method.description}
                              </p>
                            </div>
                          </motion.label>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <OrderSummary items={items} totalPrice={totalPrice} />
                  <Separator className="my-4" />
                  {PAYMENTS_ENABLED ? (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </Button>
                  ) : isAuthLoading ? (
                    <Button type="submit" className="w-full" disabled>
                      Checking sign-in...
                    </Button>
                  ) : isAuthenticated ? (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Request Quotation"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full gap-2"
                      disabled={authRedirecting}
                    >
                      <GoogleIcon className="h-4 w-4" />
                      {authRedirecting
                        ? "Redirecting to Google..."
                        : "Sign in to Request Quotation"}
                    </Button>
                  )}
                  {!PAYMENTS_ENABLED && (
                    <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      No payment is taken at this stage. You will receive your
                      quotation with pricing details.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}