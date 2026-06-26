"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { fadeUp, staggerContainer, staggerItemFast } from "@/lib/animations";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } =
    useCart();

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
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="mb-6 rounded-full bg-gray-100 p-6"
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
              Looks like you haven&apos;t added anything yet.
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-serif font-bold text-luxury-black mb-8"
          variants={fadeUp}
        >
          Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>
            <Separator className="hidden md:block" />

            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
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
                        <motion.button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 mt-1 md:hidden"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </motion.button>
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
                      <motion.button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="h-3 w-3" />
                      </motion.button>
                      <motion.span
                        key={item.quantity}
                        className="w-10 text-center text-sm font-medium"
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.quantity}
                      </motion.span>
                      <motion.button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="h-3 w-3" />
                      </motion.button>
                    </div>

                    <div className="md:col-span-2 text-right flex items-center justify-between md:justify-end">
                      <span className="md:hidden text-sm text-muted-foreground">
                        Subtotal:
                      </span>
                      <span className="text-sm font-medium text-luxury-gold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <motion.button
                        onClick={() => removeItem(item.id)}
                        className="hidden md:flex ml-4 text-muted-foreground hover:text-red-500 transition-colors"
                        whileHover={{ scale: 1.2, color: "#ef4444" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  <Separator />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
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
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
