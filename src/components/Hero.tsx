"use client";

import { useState, useEffect } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { HERO_SCREENS } from "@/lib/constants";
import StoreBadges from "./StoreBadges";

const ROTATE_MS = 4500;

export default function Hero() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isPaused || reduceMotion) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_SCREENS.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [isPaused, reduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-0 lg:min-h-[calc(100svh-61px)] grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-left"
          >
            <h1 className="font-playfair text-[2.75rem] sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-textPrimary text-balance">
              Frases del universo anime, en tu pantalla cada día
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-textSecondary">
              Desliza, guarda tus favoritas y recíbelas en notificaciones o en
              tu widget. Gratis y sin registro.
            </p>
            <div className="mt-10">
              <StoreBadges align="start" showDivider={false} showCaptions={false} />
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className="relative flex flex-col items-center"
          >
            {/* Flat disc behind the phone */}
            <div
              className="pointer-events-none absolute left-1/2 top-[44%] h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[460px] lg:w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10"
              aria-hidden="true"
            />

            <div className="relative w-[230px] sm:w-[260px] lg:w-[clamp(230px,calc((100svh_-_230px)_*_0.4734),320px)] aspect-[1408/2974] drop-shadow-[0_28px_36px_rgb(var(--accent)/0.28)]">
              {HERO_SCREENS.map((screen, i) => (
                <motion.div
                  key={screen.src}
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                  aria-hidden={i !== active}
                >
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    fill
                    sizes="(min-width: 1024px) 320px, 260px"
                    className="object-contain"
                    priority={i === 0}
                  />
                </motion.div>
              ))}
            </div>

            <div
              role="group"
              aria-label="Pantallas de la app"
              className="relative mt-6 flex items-center justify-center gap-2"
            >
              {HERO_SCREENS.map((screen, i) => (
                <button
                  key={screen.label}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    i === active
                      ? "bg-accent text-canvas"
                      : "text-textSecondary hover:text-accent hover:bg-accent/10"
                  }`}
                >
                  {screen.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
