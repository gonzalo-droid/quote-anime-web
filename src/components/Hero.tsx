"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_QUOTES } from "@/lib/constants";
import Image from "next/image";
import StoreBadges from "./StoreBadges";

export default function Hero() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % HERO_QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = HERO_QUOTES[quoteIndex];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bgDark via-[#0F0A2E] to-[#1A0A2E]" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-surface border border-accent/20 flex items-center justify-center glow-purple-sm">
            
             <Image
                            src="/images/logo_white.png"
                            alt="Quote Anime Logo"
                            width={140}
                            height={56}
                            className="h-12 w-auto object-contain"
                            priority
                          />

          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold text-textPrimary mb-4 tracking-tight"
        >
          Frases{" "}
          <span className="text-gradient">Anime</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="text-lg md:text-xl text-textSecondary mb-12 max-w-xl mx-auto"
        >
          Frases motivacionales del universo anime, <br/>en tu pantalla cada día
        </motion.p>

        {/* Animated quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="relative min-h-[140px] md:min-h-[120px] mb-12 flex items-center justify-center"
        >
          <div className="w-full max-w-2xl mx-auto bg-surface/60 border border-accent/10 rounded-2xl px-8 py-6 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <p className="font-playfair italic text-lg md:text-xl text-textPrimary leading-relaxed mb-3">
                  &ldquo;{currentQuote.text}&rdquo;
                </p>
                <p className="text-sm text-accent font-medium">
                  — {currentQuote.author}{" "}
                  <span className="text-textSecondary font-normal">
                    · {currentQuote.anime}
                  </span>
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Quote dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {HERO_QUOTES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setQuoteIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === quoteIndex
                      ? "bg-accent w-4"
                      : "bg-textSecondary/40"
                  }`}
                  aria-label={`Ver frase ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Store badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
        >
          <StoreBadges showCaptions={false} />
        </motion.div>

        {/* Secondary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
          className="mt-8 flex justify-center"
        >
          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 border border-accent/40 text-accent hover:border-accent hover:bg-accent/5 font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
          >
            Ver características
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
