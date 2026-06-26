"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { SITE_CONFIG } from "@/lib/constants";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart, MessageCircle } from "lucide-react";
import { fadeUp, staggerContainer, staggerItemFast } from "@/lib/animations";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    slug: string;
    images: string[];
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0] || "",
    });
    toast.success(`${product.name} added to cart`);
  };

  const whatsappNumber = SITE_CONFIG.whatsapp?.replace(/[^0-9]/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in "${product.name}" (${SITE_CONFIG.url}/product/${product.slug})`
  );

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItemFast}>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black">
          {product.name}
        </h1>
        <motion.p
          className="text-2xl font-bold text-gold mt-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {formatPrice(product.price)}
        </motion.p>
      </motion.div>

      <motion.p
        variants={staggerItemFast}
        className="text-muted-foreground leading-relaxed"
      >
        {product.description}
      </motion.p>

      <motion.div variants={staggerItemFast} className="flex items-center gap-4">
        <span className="text-sm font-medium text-luxury-black">Quantity:</span>
        <div className="flex items-center border rounded-md">
          <motion.button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-100 transition-colors"
            disabled={quantity <= 1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Minus className="h-4 w-4" />
          </motion.button>
          <motion.span
            key={quantity}
            className="px-6 py-2 font-medium text-center min-w-[3rem] border-x"
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {quantity}
          </motion.span>
          <motion.button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={staggerItemFast} className="space-y-3">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-gold text-luxury-black hover:bg-gold-dark font-semibold text-base py-6"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart — {formatPrice(product.price * quantity)}
        </Button>

        <motion.a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button
            variant="outline"
            className="w-full border-gold text-gold hover:bg-gold hover:text-white font-semibold text-base py-6"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Inquiry via WhatsApp
          </Button>
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
