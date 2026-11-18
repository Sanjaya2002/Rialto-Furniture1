export const SITE_CONFIG = {
  name: "Rialto Furniture",
  tagline: "Where Comfort Meets Style",
  description:
    "Office, commercial and educational furniture made to work hard and look considered. Designed and delivered across Sri Lanka by Rialto Furniture.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.rialtofurniture.lk",
  /** Primary email (general enquiries). */
  email: "info@rialtofurniture.lk",
  emails: [
    { label: "General", address: "info@rialtofurniture.lk" },
    { label: "Sales", address: "sales@rialtofurniture.lk" },
  ],
  /** Primary phone, shown where only one number fits. */
  phone: "076 213 5262",
  phones: ["076 213 5262", "076 496 5262"],
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+94764965262",
  whatsappDisplay: "076 496 5262",
  address: "100/8, Radawana Road, Yakkala",
  locality: "Yakkala",
};

/** "076 213 5262" -> "tel:+94762135262" */
export const telHref = (phone: string) => {
  const digits = phone.replace(/[^0-9]/g, "");
  return `tel:+${digits.startsWith("0") ? `94${digits.slice(1)}` : digits}`;
};

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE_CONFIG.address}, Sri Lanka`,
)}`;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, "")}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

/** Pre-filled WhatsApp enquiry for a specific product. */
export const productEnquiryLink = (productName: string, slug?: string) =>
  whatsappLink(
    `Hi Rialto Furniture, I'm interested in the ${productName}. I saw it on your website${
      slug ? ` (${SITE_CONFIG.url}/product/${slug})` : ""
    } and would like to know more about availability and delivery.`,
  );

// TODO(client): replace with the real page URLs once Rialto shares them.
export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com/rialtofurniture" },
  { label: "Instagram", href: "https://instagram.com/rialtofurniture" },
  { label: "LinkedIn", href: "https://linkedin.com/company/rialtofurniture" },
  { label: "TikTok", href: "https://tiktok.com/@rialtofurniture" },
] as const;

/**
 * The four Rialto product lines shown in the solution bar.
 * `productSlug` must match a product in the catalogue (see prisma/catalogue.js).
 */
export const SOLUTIONS = [
  {
    name: "Rialto Essential",
    segment: "Office chair",
    tagline: "Practical comfort for everyday work.",
    productSlug: "rialto-essential-office-chair",
    categorySlug: "office-chairs",
  },
  {
    name: "Rialto Premium",
    segment: "Executive chair",
    tagline: "Designed for elevated workspaces.",
    productSlug: "rialto-premium-executive-chair",
    categorySlug: "executive-chairs",
  },
  {
    name: "Rialto Lecture",
    segment: "Lecture chair",
    tagline: "Functional seating for learning spaces.",
    productSlug: "rialto-lecture-chair",
    categorySlug: "lecture-chairs",
  },
  {
    name: "Rialto Classic",
    segment: "Reception chair",
    tagline: "A welcoming choice for reception spaces.",
    productSlug: "rialto-classic-reception-chair",
    categorySlug: "reception-chairs",
  },
] as const;

/** Short selling line per category, shown on "Shop by category" cards. */
export const CATEGORY_TAGLINES: Record<string, string> = {
  "office-chairs": "Comfort for productive workspaces.",
  "executive-chairs": "Elevated comfort. Refined design.",
  "premium-chairs": "Elevated comfort. Refined design.",
  "reception-chairs": "Make every first impression count.",
  "lecture-chairs": "Functional spaces for learning.",
  "educational-furniture": "Functional spaces for learning.",
};

/** Customer promises shown in the strip above the footer. */
export const SERVICE_PROMISES = [
  { key: "delivery", title: "Island-wide delivery", body: "Delivered and set up anywhere in Sri Lanka" },
  { key: "warranty", title: "1-year+ warranty", body: "Every chair is backed by our warranty" },
  { key: "support", title: "After-sales support", body: "We stay with you long after delivery" },
  { key: "payment", title: "Flexible payment plans", body: "Payment options that suit your budget" },
] as const;

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Custom work", href: "/custom-order" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const ORDER_STATUSES = ["Pending", "Processing", "Completed", "Cancelled"] as const;
export const CUSTOM_ORDER_STATUSES = ["Pending", "In Review", "Approved", "Rejected"] as const;
export const QUOTATION_STATUSES = ["Pending", "Processing", "Approved", "Rejected"] as const;
export const CONTACT_STATUSES = ["New", "Read", "Replied"] as const;

export const FURNITURE_TYPES = ["Chair", "Desk", "Table", "Cabinet", "Sofa", "Workstation", "Other"] as const;

/** Editorial imagery used where the catalogue has no photo of its own. */
export const IMAGERY = {
  hero: "/images/hero.jpg",
  corridor: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
  workspace: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&q=80",
  craft: "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80",
  lounge: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&q=80",
  detail: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1200&q=80",
  productFallback: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1000&q=80",
} as const;
