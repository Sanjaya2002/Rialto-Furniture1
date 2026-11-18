import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { LegalPage, LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${SITE_CONFIG.name} Privacy Policy — how we collect, use, and protect your personal information.`,
  openGraph: {
    title: `Privacy Policy | ${SITE_CONFIG.name}`,
    description: `${SITE_CONFIG.name} Privacy Policy — how we collect, use, and protect your personal information.`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy *policy*">
      <p className="text-lg text-ink">
        At {SITE_CONFIG.name}, we take your privacy seriously. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you visit our website or use our services.
      </p>

      <LegalSection title="Information We Collect">
        <p>
          We collect information you provide directly to us, including your name, email address, phone number,
          delivery address, and any other information you submit through our contact forms, quotation
          requests, or custom furniture requests. If you sign in with Google to request a quotation, we
          receive your name, email address and profile picture from Google.
        </p>
        <p>
          We also automatically collect certain data when you visit our website, such as your IP address,
          browser type, device information, browsing behavior, and cookies as described below.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Your Information">
        <p>
          We use the information we collect to prepare quotations and fulfil orders, communicate with you
          about your requests, provide customer support, improve our products and services, send promotional
          materials (with your consent), and comply with legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="Data Protection">
        <p>
          We implement appropriate technical and organizational measures to protect your personal data against
          unauthorized access, alteration, disclosure, or destruction. All data sent to and from this website
          is encrypted in transit using TLS.
        </p>
        <p>
          Your data is stored on secure servers located in Sri Lanka and internationally, and we retain your
          information only as long as necessary to fulfill the purposes outlined in this policy.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Our website uses cookies and similar tracking technologies to enhance your browsing experience,
          analyze site traffic, and understand where our visitors come from. You can control cookie
          preferences through your browser settings.
        </p>
        <p>
          We use essential cookies required for the website to function, analytics cookies to understand usage
          patterns, and functional cookies to remember your preferences.
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Services">
        <p>
          We may share your information with trusted third-party service providers who assist us in operating
          our website, hosting data, delivering orders, and analyzing data. These providers are contractually
          obligated to protect your information.
        </p>
        <p>
          We do not sell, trade, or rent your personal information to third parties for their marketing
          purposes without your explicit consent.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights">
        <p>
          You have the right to access, correct, update, or delete your personal information held by us. You
          may also object to or restrict certain processing activities, and where applicable, exercise your
          right to data portability.
        </p>
        <p>
          To exercise any of these rights, please contact us using the information provided below. We will
          respond to your request within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="Contact Us">
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data
          practices, please contact us:
        </p>
        <ul>
          <li>Email: {SITE_CONFIG.email}</li>
          <li>Phone: {SITE_CONFIG.phones.join(" / ")}</li>
          <li>Address: {SITE_CONFIG.address}</li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
