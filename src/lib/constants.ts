export const SITE_CONFIG = {
  name: "Rialto Furniture",
  tagline: "Where Comfort Meets Style",
  description:
    "Office, commercial and educational furniture made to work hard and look considered. Designed and delivered across Sri Lanka by Rialto Furniture.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.rialtofurniture.com",
  email: "info@rialtofurniture.com",
  phone: "+94 77 123 4567",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+94771234567",
  address: "123 Galle Road, Colombo 03, Sri Lanka",
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, "")}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com/rialtofurniture" },
  { label: "Instagram", href: "https://instagram.com/rialtofurniture" },
  { label: "LinkedIn", href: "https://linkedin.com/company/rialtofurniture" },
  { label: "TikTok", href: "https://tiktok.com/@rialtofurniture" },
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
