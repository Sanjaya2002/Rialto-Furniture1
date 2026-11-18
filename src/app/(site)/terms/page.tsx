import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { LegalPage, LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `${SITE_CONFIG.name} Terms & Conditions — governing the use of our website and purchase of our products.`,
  openGraph: {
    title: `Terms & Conditions | ${SITE_CONFIG.name}`,
    description: `${SITE_CONFIG.name} Terms & Conditions — governing the use of our website and purchase of our products.`,
  },
};

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms & *conditions*">
      <p className="text-lg text-ink">
        Please read these Terms & Conditions carefully before using the {SITE_CONFIG.name} website or placing
        an order. By accessing or using our site, you agree to be bound by these terms.
      </p>

      <LegalSection title="Introduction">
        <p>
          These Terms & Conditions govern your use of the {SITE_CONFIG.name} website and the purchase of any
          products from our store. {SITE_CONFIG.name} operates as a furniture retailer based in Sri Lanka,
          offering office, commercial, and educational furniture solutions.
        </p>
        <p>
          We reserve the right to update or modify these terms at any time without prior notice. It is your
          responsibility to review this page periodically for changes.
        </p>
      </LegalSection>

      <LegalSection title="Products & Pricing">
        <p>
          All product descriptions, images, and pricing are subject to change without notice. We strive to
          display accurate colours and details, but we cannot guarantee that your screen display reflects the
          exact appearance of the product.
        </p>
        <p>
          Prices are listed in Sri Lankan Rupees (LKR) and include all applicable taxes unless stated
          otherwise. We reserve the right to correct any pricing errors before accepting an order.
        </p>
      </LegalSection>

      <LegalSection title="Orders & Payment">
        <p>
          By placing an order, you agree to provide accurate and complete information. We reserve the right to
          refuse or cancel any order for reasons including product availability, pricing errors, or suspected
          fraudulent activity.
        </p>
        <p>
          No payment is taken on this website. Submitting your cart creates a quotation request; our team then
          sends you a written quotation. An order is confirmed only once you accept that quotation, and
          payment terms are set out in it.
        </p>
      </LegalSection>

      <LegalSection title="Delivery">
        <p>
          We deliver throughout Sri Lanka. Delivery timelines are estimates and may vary based on location,
          product availability, and unforeseen circumstances. We are not liable for delays caused by
          third-party carriers or events beyond our control.
        </p>
        <p>
          Delivery charges are confirmed in your quotation and are based on the delivery address and order
          value. A signature may be required upon delivery to confirm receipt.
        </p>
      </LegalSection>

      <LegalSection title="Returns & Refunds">
        <p>
          We want you to be completely satisfied with your purchase. If you are not happy with your order,
          please contact us within 7 days of delivery to initiate a return or exchange.
        </p>
        <p>
          Items must be returned in their original condition and packaging. Custom-made and personalized
          furniture orders are non-refundable unless there is a manufacturing defect. Refunds will be
          processed within 14 business days after we receive the returned item.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <p>
          All content on this website — including text, images, logos, designs, and product descriptions — is
          the intellectual property of {SITE_CONFIG.name} and is protected by applicable copyright and
          trademark laws. Unauthorized use or reproduction is strictly prohibited.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          {SITE_CONFIG.name} shall not be held liable for any indirect, incidental, or consequential damages
          arising out of the use or inability to use our products or website. Our total liability shall not
          exceed the amount paid by you for the product in question.
        </p>
      </LegalSection>

      <LegalSection title="Governing Law">
        <p>
          These Terms & Conditions shall be governed by and construed in accordance with the laws of Sri
          Lanka. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the
          courts of Colombo, Sri Lanka.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
