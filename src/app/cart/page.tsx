"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import OrderSummary from "@/components/checkout/order-summary";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } =
    useCart();

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
              Looks like you haven&apos;t added anything yet.
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
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>
            <Separator className="hidden md:block" />

            {items.map((item) => (
              <div key={item.id}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-4">
                  <div className="md:col-span-5 flex items-center gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-luxury-black">
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 mt-1 md:hidden"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-center">
                    <span className="md:hidden text-sm text-muted-foreground mr-2">
                      Price:
                    </span>
                    <span className="text-sm font-medium">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="md:col-span-3 flex items-center justify-center gap-2">
                    <span className="md:hidden text-sm text-muted-foreground mr-2">
                      Qty:
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="md:col-span-2 text-right flex items-center justify-between md:justify-end">
                    <span className="md:hidden text-sm text-muted-foreground">
                      Subtotal:
                    </span>
                    <span className="text-sm font-medium text-luxury-gold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="hidden md:flex ml-4 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="text-lg font-semibold text-luxury-black">
                Cart Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-luxury-black">Total</span>
                <span className="text-lg font-bold text-luxury-gold">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button asChild className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
