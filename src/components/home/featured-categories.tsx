"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/constants";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

const fallbackImages: Record<string, string> = {
  "Executive Chairs": "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80",
  "Office Chairs": "https://images.unsplash.com/photo-1506439773649-6f0e8a9e5d7d?w=800&q=80",
  "Reception Chairs": "https://images.unsplash.com/photo-1529636798458-92182e4a5a0e?w=800&q=80",
  "Lecture Chairs": "https://images.unsplash.com/photo-1596073419629-1b148b8c6f4c?w=800&q=80",
};

const defaultFallback = "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      })
      .catch((err) => {
        setError(err.message);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 bg-luxury-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-heading">Shop by Category</h2>
          <p className="section-subheading">
            Explore our curated collection of premium furniture categories
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-2">Failed to load categories</p>
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
            {categories.map((category) => (
              <motion.div key={category._id} variants={itemVariants}>
                <Link href={`/shop?category=${category.slug}`}>
                  <Card className="group relative h-80 overflow-hidden border-0 rounded-lg cursor-pointer">
                    <div className="absolute inset-0">
                      <img
                        src={category.image || fallbackImages[category.name] || defaultFallback}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 transition-all duration-300 group-hover:bg-black/60" />
                    <div className="absolute inset-0 border-0 transition-all duration-300 group-hover:border-2 group-hover:border-gold rounded-lg" />
                    <CardContent className="relative h-full flex flex-col justify-end p-6">
                      <h3 className="text-xl font-serif font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-200 mb-4 line-clamp-2">{category.description}</p>
                      <span className="text-gold text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Shop Now &rarr;
                      </span>
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
