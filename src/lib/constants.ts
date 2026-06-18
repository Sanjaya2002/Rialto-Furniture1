export const SITE_CONFIG = {
  name: "Rialto Furniture",
  tagline: "Where Comfort Meets Style",
  description:
    "Premium furniture retailer specializing in office, commercial, and educational furniture. Rialto Furniture brings elegance and comfort to every space.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.rialtofurniture.com",
  email: "info@rialtofurniture.com",
  phone: "+94 77 123 4567",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+94771234567",
  address: "123 Galle Road, Colombo 03, Sri Lanka",
};

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/rialtofurniture",
  instagram: "https://instagram.com/rialtofurniture",
  linkedin: "https://linkedin.com/company/rialtofurniture",
  tiktok: "https://tiktok.com/@rialtofurniture",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Custom Orders", href: "/custom-order" },
];

export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Custom Orders", href: "/custom-order" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
  categories: [
    { label: "Executive Chairs", href: "/shop?category=executive-chairs" },
    { label: "Office Chairs", href: "/shop?category=office-chairs" },
    { label: "Reception Chairs", href: "/shop?category=reception-chairs" },
    { label: "Lecture Chairs", href: "/shop?category=lecture-chairs" },
  ],
};

export const WHY_CHOOSE_US = [
  {
    title: "Premium Quality",
    description:
      "Handpicked materials and expert craftsmanship ensure every piece meets our exacting standards.",
    icon: "Award",
  },
  {
    title: "Fast Delivery",
    description:
      "Swift, reliable delivery across Sri Lanka with careful handling and professional setup.",
    icon: "Truck",
  },
  {
    title: "Custom Orders",
    description:
      "Bespoke furniture solutions tailored to your specific requirements and space constraints.",
    icon: "Paintbrush",
  },
  {
    title: "Trusted Service",
    description:
      "Dedicated support from consultation to after-sales, ensuring complete satisfaction.",
    icon: "ShieldCheck",
  },
];

export const ORDER_STATUSES = ["Pending", "Processing", "Completed", "Cancelled"] as const;

export const CUSTOM_ORDER_STATUSES = ["Pending", "In Review", "Approved", "Rejected"] as const;

export const PAYMENT_METHODS = [
  { id: "payhere", label: "PayHere", description: "Pay via credit card, debit card, or online banking" },
  { id: "koko", label: "KOKO Payment", description: "Pay using KOKO payment system" },
  { id: "cod", label: "Cash on Delivery", description: "Pay when you receive your order" },
] as const;
