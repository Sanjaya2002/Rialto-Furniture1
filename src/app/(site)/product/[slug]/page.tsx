import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { IMAGERY, SITE_CONFIG } from "@/lib/constants";
import { toProductSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getProductBySlug, getRelatedProducts } from "@/server/services/products";
import { listProductReviews } from "@/server/services/reviews";
import { safely } from "@/server/safely";
import { ProductGallery } from "@/components/site/product/product-gallery";
import { ProductPurchase } from "@/components/site/product/product-purchase";
import { ProductCard } from "@/components/site/product/product-card";
import { ReviewForm } from "@/components/site/product/review-form";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

const loadProduct = cache((slug: string) => getProductBySlug(slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await loadProduct((await params).slug);
  if (!product) return { title: "Product not found" };

  const description = product.description.slice(0, 160);
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

function toSpecs(value: unknown): [string, string][] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => [k, typeof v === "object" ? JSON.stringify(v) : String(v)]);
}

export default async function ProductPage({ params }: Props) {
  const product = await loadProduct((await params).slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    safely(() => listProductReviews(product.id), [], "product reviews"),
    safely(() => getRelatedProducts(product.categoryId, product.id, 4), [], "related products"),
  ]);

  const images = product.images.length ? product.images : [IMAGERY.productFallback];
  const specs = toSpecs(product.specifications);
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images,
    sku: product.id,
    category: product.category.name,
    brand: { "@type": "Brand", name: SITE_CONFIG.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "LKR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      url: `${SITE_CONFIG.url}/product/${product.slug}`,
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: average.toFixed(1),
        reviewCount: reviews.length,
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container pt-24 md:pt-32">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink-muted md:mb-10">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/shop" className="hover:text-ink">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink">
                {product.category.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="truncate text-ink" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 md:grid-cols-12 md:gap-8 lg:gap-16">
          <div className="md:col-span-7">
            <ProductGallery images={images} name={product.name} />
          </div>
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <ProductPurchase
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  description: product.description,
                  image: images[0],
                  categoryName: product.category.name,
                }}
                rating={{ average, count: reviews.length }}
              />
            </div>
          </div>
        </div>
      </div>

      {specs.length > 0 && (
        <section className="container mt-24 md:mt-36">
          <div className="grid gap-10 border-t pt-10 lg:grid-cols-12">
            <h2 className="text-display-sm lg:col-span-4">Specifications</h2>
            <dl className="grid divide-y border-b lg:col-span-8">
              {specs.map(([key, value]) => (
                <Reveal
                  key={key}
                  y={12}
                  className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 py-4 text-sm"
                >
                  <dt className="capitalize text-ink-muted">{key.replace(/[_-]/g, " ")}</dt>
                  <dd>{value}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section id="reviews" className="container mt-24 scroll-mt-24 md:mt-36">
        <div className="grid gap-12 border-t pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-display-sm">Reviews</h2>
            {reviews.length > 0 ? (
              <p className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-5xl tabular-nums">{average.toFixed(1)}</span>
                <span className="text-sm text-ink-muted">
                  from {reviews.length} review{reviews.length === 1 ? "" : "s"}
                </span>
              </p>
            ) : (
              <p className="mt-4 text-ink-muted">
                No reviews yet — be the first to share how it’s working for you.
              </p>
            )}
            <div className="mt-10 rounded-sm bg-bone p-6">
              <p className="mb-6 font-display text-xl">Write a review</p>
              <ReviewForm productId={product.id} />
            </div>
          </div>

          <ul className="divide-y lg:col-span-7 lg:col-start-6">
            {reviews.map((review) => (
              <li key={review.id} className="py-8 first:pt-0">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-accent" aria-label={`${review.rating} out of 5`}>
                    {"★".repeat(review.rating)}
                    <span className="text-ink/15">{"★".repeat(5 - review.rating)}</span>
                  </span>
                  <span className="text-xs text-ink-muted">{formatDate(review.createdAt)}</span>
                </div>
                <p className="leading-relaxed">{review.comment}</p>
                <p className="mt-3 text-sm font-medium">{review.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container mb-24 mt-24 md:mb-36 md:mt-36">
          <div className="mb-12 flex items-end justify-between gap-6 border-t pt-10">
            <SplitText text={"More from\n*" + product.category.name + "*"} className="text-display-md" />
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="link-underline shrink-0 text-sm"
            >
              View range
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <ProductCard product={toProductSummary(p)} sizes="(min-width: 1024px) 25vw, 50vw" />
              </Reveal>
            ))}
          </div>
        </section>
      )}
      {related.length === 0 && <div className="mb-24 md:mb-36" />}
    </>
  );
}
