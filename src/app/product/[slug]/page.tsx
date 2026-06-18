import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/constants";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductSpecifications from "@/components/product/product-specifications";
import ReviewSection from "@/components/product/review-section";
import RelatedProducts from "@/components/product/related-products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — ${SITE_CONFIG.name}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const specs =
    typeof product.specifications === "object" && product.specifications
      ? (product.specifications as Record<string, string>)
      : {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "LKR",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_CONFIG.url}/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <ProductGallery images={product.images} />
            <ProductInfo
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                slug: product.slug,
                images: product.images,
              }}
            />
          </div>

          {Object.keys(specs).length > 0 && (
            <ProductSpecifications specifications={specs} />
          )}

          <ReviewSection productId={product.id} />

          <RelatedProducts
            categoryId={product.categoryId}
            currentProductId={product.id}
          />
        </div>
      </div>
    </>
  );
}
