import type { Metadata } from "next";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";
import { toProductSummary } from "@/lib/types";
import { safely } from "@/server/safely";
import { listCategories } from "@/server/services/categories";
import { getFeaturedProducts } from "@/server/services/products";
import { listTestimonials } from "@/server/services/reviews";
import { Hero } from "@/components/site/home/hero";
import { Intro } from "@/components/site/home/intro";
import { CategoryRail } from "@/components/site/home/category-rail";
import { FeaturedProducts } from "@/components/site/home/featured-products";
import { MadeToMeasure } from "@/components/site/home/made-to-measure";
import { Spaces } from "@/components/site/home/spaces";
import { Testimonials } from "@/components/site/home/testimonials";
import { WhyRialto } from "@/components/site/home/why-rialto";
import { Projects } from "@/components/site/home/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 300;

export default async function HomePage() {
  const [categories, featured, reviews] = await Promise.all([
    safely(listCategories, [], "home categories"),
    safely(() => getFeaturedProducts(5), [], "featured products"),
    safely(() => listTestimonials(6), [], "testimonials"),
  ]);

  const productCount = categories.reduce((sum, c) => sum + c._count.products, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/brand/logo.png`,
    description: SITE_CONFIG.description,
    telephone: SITE_CONFIG.phones,
    email: SITE_CONFIG.emails.map((e) => e.address),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address,
      addressLocality: SITE_CONFIG.locality,
      addressCountry: "LK",
    },
    sameAs: SOCIAL_LINKS.map((s) => s.href),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Intro productCount={productCount} categoryCount={categories.length} />
      <CategoryRail
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
          productCount: c._count.products,
        }))}
      />
      <FeaturedProducts products={featured.map(toProductSummary)} />
      <WhyRialto />
      <Projects />
      <MadeToMeasure />
      <Spaces categorySlugs={categories.map((c) => c.slug)} />
      <Testimonials reviews={reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))} />
    </>
  );
}
