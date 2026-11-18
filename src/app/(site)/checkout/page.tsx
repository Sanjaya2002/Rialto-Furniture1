import type { Metadata } from "next";
import { QuotationCheckout } from "@/components/site/checkout/quotation-checkout";

export const metadata: Metadata = {
  title: "Request a quotation",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <QuotationCheckout />;
}
