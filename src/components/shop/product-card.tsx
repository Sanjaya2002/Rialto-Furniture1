"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { toast } from "sonner";

interface ProductCardProduct {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { name: string; slug?: string };
  description?: string;
}

interface ProductCardProps {
  product: ProductCardProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id || product._id || product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || "",
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Card className="group overflow-hidden border border-gray-100 hover:border-gold transition-all duration-300 h-full flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="relative h-64 overflow-hidden bg-gray-50 block"
      >
        <img
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.category?.name && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-luxury-black border-0">
            {product.category.name}
          </Badge>
        )}
      </Link>
      <CardContent className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif font-semibold text-lg text-luxury-black group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gold font-bold text-lg mt-1">{formatPrice(product.price)}</p>
        <Button
          onClick={handleAddToCart}
          className="mt-auto w-full bg-gold text-luxury-black hover:bg-gold-dark font-semibold"
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
