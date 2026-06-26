"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  category: { name: string };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      })
      .catch((err) => {
        setError(err.message);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0 && !error) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-heading">Featured Products</h2>
          <p className="section-subheading">
            Handpicked pieces to elevate your space
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-2">Failed to load products</p>
            <button
              onClick={() => window.location.reload()}
              className="text-gold hover:underline text-sm"
            >
              Try again
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <Link href={`/product/${product.slug}`}>
                  <Card className="group overflow-hidden border border-gray-100 hover:border-gold transition-all duration-300 cursor-pointer h-full">
                    <div className="relative h-64 overflow-hidden bg-gray-50">
                      <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1506439773649-6f0e8a9e5d7d?w=800&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.category?.name && (
                        <Badge className="absolute top-3 left-3 bg-white/90 text-luxury-black border-0">
                          {product.category.name}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-serif font-semibold text-lg text-luxury-black group-hover:text-gold transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gold font-bold text-lg mt-2">{formatPrice(product.price)}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
