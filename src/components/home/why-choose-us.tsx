"use client";

import { motion } from "framer-motion";
import { Award, Truck, Paintbrush, ShieldCheck } from "lucide-react";
import { WHY_CHOOSE_US } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Award,
  Truck,
  Paintbrush,
  ShieldCheck,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4 bg-luxury-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-heading">Why Choose Rialto?</h2>
          <p className="section-subheading">
            We are committed to delivering excellence in every piece we create
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {WHY_CHOOSE_US.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group text-center p-8 rounded-lg bg-white border border-gray-100 hover:border-gold/50 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-5 group-hover:bg-gold/20 transition-colors">
                  {Icon && <Icon className="w-8 h-8 text-gold" />}
                </div>
                <h3 className="text-xl font-serif font-bold text-luxury-black mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
