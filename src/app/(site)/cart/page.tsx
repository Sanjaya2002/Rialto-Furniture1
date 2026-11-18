import type { Metadata } from "next";
import { CartView } from "@/components/site/cart/cart-view";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default function CartPage() {
  return <CartView />;
}
