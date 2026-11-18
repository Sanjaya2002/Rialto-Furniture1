/** Serialisable shapes passed from Server to Client Components. */

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  category: { name: string; slug: string } | null;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
}

export interface ReviewSummary {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function toProductSummary(p: {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  category?: { name: string; slug: string } | null;
}): ProductSummary {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    images: p.images,
    stock: p.stock,
    category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
  };
}
