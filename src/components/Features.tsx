"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FEATURES } from "@/lib/constants";

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-bgDark via-surface/20 to-bgDark pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            Características
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-textPrimary">
            Todo lo que necesitas
          </h2>
        </motion.div>

        {/* Features grid */}
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative bg-surface border border-accent/10 hover:border-accent/30 rounded-2xl p-6 transition-colors duration-300"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative">
                <span className="text-3xl mb-4 block" role="img" aria-label={feature.title}>
                  {feature.emoji}
                </span>
                <h3 className="text-textPrimary font-semibold text-base md:text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-textSecondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
