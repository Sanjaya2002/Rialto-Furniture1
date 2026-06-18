"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/lib/constants";
import { getPayHereCheckoutUrl, getPayHereFormFields } from "@/lib/payhere";
import { initiateKOKOPayment, getKOKOPaymentUrl } from "@/lib/koko";
import OrderSummary from "@/components/checkout/order-summary";

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        email: form.email,
        phone: form.phone,
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-gray-100 p-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-luxury-black mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Add some items before checking out.
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-luxury-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black mt-2">
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-luxury-black">
                    Contact Information
                  </h2>
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
                  </div>
                </CardContent>
              </Card>

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
                      <label
                        key={method.id}
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
                      </label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <OrderSummary items={items} totalPrice={totalPrice} />
                  <Separator className="my-4" />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
