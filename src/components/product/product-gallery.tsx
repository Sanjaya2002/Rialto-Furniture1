"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={images[selectedIndex]}
            alt="Product image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <motion.div
          className="absolute inset-0"
          whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <motion.button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                idx === selectedIndex
                  ? "border-gold"
                  : "border-transparent hover:border-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={img}
                alt={`Product thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
