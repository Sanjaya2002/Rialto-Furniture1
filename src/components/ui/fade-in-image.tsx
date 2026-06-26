"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FadeInImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function FadeInImage({ src, alt, className, ...props }: FadeInImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className={`overflow-hidden ${className || ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
        {...props}
      />
    </motion.div>
  );
}
