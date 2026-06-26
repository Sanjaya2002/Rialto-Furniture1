"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/shop/product-card";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  category: { name: string; slug: string };
}

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export default function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }
    fetch(`/api/products?category=${categoryId}&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        const allProducts = Array.isArray(data)
          ? data
          : data.products || [];
        setProducts(
          allProducts.filter(
            (p: Product) => p.id !== currentProductId
          )
        );
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categoryId, currentProductId]);

  if (!loading && products.length === 0) return null;

  return (
    <motion.div
      className="mt-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.h2
        variants={staggerItem}
        className="text-2xl font-serif font-bold text-luxury-black mb-8"
      >
        Related Products
      </motion.h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.slice(0, 4).map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
