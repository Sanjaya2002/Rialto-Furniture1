import { type Variants, type Transition } from "framer-motion";

export const defaultTransition: Transition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1],
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const quickTransition: Transition = {
  duration: 0.3,
  ease: "easeOut" as const,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: defaultTransition },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
};

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { ...defaultTransition, duration: 0.4 } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: defaultTransition },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: defaultTransition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: defaultTransition },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
};

export const staggerItemFast: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ...defaultTransition, duration: 0.4 } },
};

export const cardHover = {
  rest: {
    y: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  hover: {
    y: -6,
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export const imageZoom = {
  rest: { scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  hover: { scale: 1.08, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export const buttonScale = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2, ease: "easeOut" as const } },
  tap: { scale: 0.97, transition: { duration: 0.1, ease: "easeOut" as const } },
};

export const navLinkUnderline = {
  rest: { scaleX: 0, originX: 0.5 },
  hover: { scaleX: 1, originX: 0.5, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: "easeIn" as const } },
};
