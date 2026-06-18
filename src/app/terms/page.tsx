import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `${SITE_CONFIG.name} Terms & Conditions — governing the use of our website and purchase of our products.`,
  openGraph: {
    title: `Terms & Conditions | ${SITE_CONFIG.name}`,
    description: `${SITE_CONFIG.name} Terms & Conditions — governing the use of our website and purchase of our products.`,
  },
};

export default function TermsPage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen pt-28 pb-20">
      <section className="bg-luxury-gray py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black">
            Terms & <span className="text-gold">Conditions</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-muted-foreground leading-relaxed mb-8">
            Please read these Terms & Conditions carefully before using the {SITE_CONFIG.name} website or
            placing an order. By accessing or using our site, you agree to be bound by these terms.
          </p>

          <TermsSection title="Introduction">
            <p>
              These Terms & Conditions govern your use of the {SITE_CONFIG.name} website and the purchase
              of any products from our store. {SITE_CONFIG.name} operates as a furniture retailer based in
              Sri Lanka, offering office, commercial, and educational furniture solutions.
            </p>
            <p className="mt-4">
              We reserve the right to update or modify these terms at any time without prior notice. It is
              your responsibility to review this page periodically for changes.
            </p>
          </TermsSection>

          <TermsSection title="Products & Pricing">
            <p>
              All product descriptions, images, and pricing are subject to change without notice. We strive
              to display accurate colours and details, but we cannot guarantee that your screen display
              reflects the exact appearance of the product.
            </p>
            <p className="mt-4">
              Prices are listed in Sri Lankan Rupees (LKR) and include all applicable taxes unless stated
              otherwise. We reserve the right to correct any pricing errors before accepting an order.
            </p>
          </TermsSection>

          <TermsSection title="Orders & Payment">
            <p>
              By placing an order, you agree to provide accurate and complete information. We reserve the
              right to refuse or cancel any order for reasons including product availability, pricing errors,
              or suspected fraudulent activity.
            </p>
            <p className="mt-4">
              Payment must be received in full before an order is processed. We accept payments via PayHere,
              KOKO Payment, and Cash on Delivery (COD). Your payment information is processed securely and
              is not stored on our servers.
            </p>
          </TermsSection>

          <TermsSection title="Delivery">
            <p>
              We deliver throughout Sri Lanka. Delivery timelines are estimates and may vary based on
              location, product availability, and unforeseen circumstances. We are not liable for delays
              caused by third-party carriers or events beyond our control.
            </p>
            <p className="mt-4">
              Delivery charges are calculated at checkout and are based on the delivery address and order
              value. A signature may be required upon delivery to confirm receipt.
            </p>
          </TermsSection>

          <TermsSection title="Returns & Refunds">
            <p>
              We want you to be completely satisfied with your purchase. If you are not happy with your
              order, please contact us within 7 days of delivery to initiate a return or exchange.
            </p>
            <p className="mt-4">
              Items must be returned in their original condition and packaging. Custom-made and
              personalized furniture orders are non-refundable unless there is a manufacturing defect.
              Refunds will be processed within 14 business days after we receive the returned item.
            </p>
          </TermsSection>

          <TermsSection title="Intellectual Property">
            <p>
              All content on this website — including text, images, logos, designs, and product
              descriptions — is the intellectual property of {SITE_CONFIG.name} and is protected by
              applicable copyright and trademark laws. Unauthorized use or reproduction is strictly
              prohibited.
            </p>
          </TermsSection>

          <TermsSection title="Limitation of Liability">
            <p>
              {SITE_CONFIG.name} shall not be held liable for any indirect, incidental, or consequential
              damages arising out of the use or inability to use our products or website. Our total
              liability shall not exceed the amount paid by you for the product in question.
            </p>
          </TermsSection>

          <TermsSection title="Governing Law">
            <p>
              These Terms & Conditions shall be governed by and construed in accordance with the laws of
              Sri Lanka. Any disputes arising from these terms shall be subject to the exclusive jurisdiction
              of the courts of Colombo, Sri Lanka.
            </p>
          </TermsSection>

          <div className="border-t border-gray-200 mt-12 pt-8 text-sm text-muted-foreground">
            &copy; {year} {SITE_CONFIG.name}. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
}

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-serif font-bold text-luxury-black mb-4">{title}</h2>
      <div className="w-12 h-1 bg-gold mb-4" />
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
