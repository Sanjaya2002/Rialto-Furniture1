import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${SITE_CONFIG.name} Privacy Policy — how we collect, use, and protect your personal information.`,
  openGraph: {
    title: `Privacy Policy | ${SITE_CONFIG.name}`,
    description: `${SITE_CONFIG.name} Privacy Policy — how we collect, use, and protect your personal information.`,
  },
};

export default function PrivacyPolicyPage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen pt-28 pb-20">
      <section className="bg-luxury-gray py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black">
            Privacy <span className="text-gold">Policy</span>
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
            At {SITE_CONFIG.name}, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <PolicySection title="Information We Collect">
            <p>
              We collect information you provide directly to us, including your name, email address, phone
              number, shipping address, payment details, and any other information you submit through our
              contact forms, order placements, or custom furniture requests.
            </p>
            <p className="mt-4">
              We also automatically collect certain data when you visit our website, such as your IP address,
              browser type, device information, browsing behavior, and cookies as described below.
            </p>
          </PolicySection>

          <PolicySection title="How We Use Your Information">
            <p>
              We use the information we collect to process and fulfill your orders, communicate with you
              about your purchases, provide customer support, improve our products and services, send
              promotional materials (with your consent), and comply with legal obligations.
            </p>
          </PolicySection>

          <PolicySection title="Data Protection">
            <p>
              We implement appropriate technical and organizational measures to protect your personal data
              against unauthorized access, alteration, disclosure, or destruction. All payment transactions
              are encrypted using industry-standard SSL technology.
            </p>
            <p className="mt-4">
              Your data is stored on secure servers located in Sri Lanka and internationally, and we retain
              your information only as long as necessary to fulfill the purposes outlined in this policy.
            </p>
          </PolicySection>

          <PolicySection title="Cookies">
            <p>
              Our website uses cookies and similar tracking technologies to enhance your browsing experience,
              analyze site traffic, and understand where our visitors come from. You can control cookie
              preferences through your browser settings.
            </p>
            <p className="mt-4">
              We use essential cookies required for the website to function, analytics cookies to understand
              usage patterns, and functional cookies to remember your preferences.
            </p>
          </PolicySection>

          <PolicySection title="Third-Party Services">
            <p>
              We may share your information with trusted third-party service providers who assist us in
              operating our website, processing payments, delivering orders, and analyzing data. These
              providers are contractually obligated to protect your information.
            </p>
            <p className="mt-4">
              We do not sell, trade, or rent your personal information to third parties for their marketing
              purposes without your explicit consent.
            </p>
          </PolicySection>

          <PolicySection title="Your Rights">
            <p>
              You have the right to access, correct, update, or delete your personal information held by us.
              You may also object to or restrict certain processing activities, and where applicable,
              exercise your right to data portability.
            </p>
            <p className="mt-4">
              To exercise any of these rights, please contact us using the information provided below. We
              will respond to your request within 30 days.
            </p>
          </PolicySection>

          <PolicySection title="Contact Us">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data
              practices, please contact us:
            </p>
            <ul className="list-none space-y-1 mt-4 text-muted-foreground">
              <li>Email: {SITE_CONFIG.email}</li>
              <li>Phone: {SITE_CONFIG.phone}</li>
              <li>Address: {SITE_CONFIG.address}</li>
            </ul>
          </PolicySection>

          <div className="border-t border-gray-200 mt-12 pt-8 text-sm text-muted-foreground">
            &copy; {year} {SITE_CONFIG.name}. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-serif font-bold text-luxury-black mb-4">{title}</h2>
      <div className="w-12 h-1 bg-gold mb-4" />
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
