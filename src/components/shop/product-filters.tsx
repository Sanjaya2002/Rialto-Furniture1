"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { fadeUpSmall } from "@/lib/animations";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) =>
        setCategories(Array.isArray(data) ? data : data.categories || [])
      )
      .catch(() => setCategories([]));
  }, []);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const prevSearch = params.get("search") || "";
      if (search !== prevSearch) {
        if (search) {
          params.set("search", search);
        } else {
          params.delete("search");
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, searchParams, router, pathname]);

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";

  const hasFilters = currentCategory || currentSort || search;

  const clearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  const filtersContent = (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          value={currentCategory || "all"}
          onValueChange={(value) =>
            updateParams("category", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentSort || "default"}
          onValueChange={(value) =>
            updateParams("sort", value === "default" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </motion.div>
        )}
      </div>
    </>
  );

  return (
    <>
      <motion.div
        className="hidden md:flex flex-col gap-4 mb-8"
        variants={fadeUpSmall}
        initial="hidden"
        animate="visible"
      >
        {filtersContent}
      </motion.div>

      <div className="md:hidden mb-4">
        <motion.button
          className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {hasFilters && (
            <span className="ml-2 w-2 h-2 rounded-full bg-gold" />
          )}
        </motion.button>
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-4 mt-4 p-4 border rounded-lg bg-white overflow-hidden"
            >
              {filtersContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
