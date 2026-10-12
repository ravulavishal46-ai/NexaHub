"use client";

import { motion, type HTMLMotionProps } from "motion/react";

/**
 * Fades + lifts content into view once as it scrolls onto the screen.
 * Motion automatically respects the "reduce motion" OS setting via MotionConfig.
 */
export function Reveal({
  delay = 0,
  y = 16,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.6, 0.35, 1] }}
      {...props}
    />
  );
}
