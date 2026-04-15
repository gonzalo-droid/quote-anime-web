"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const CARDS = [
  {
    src: "/images/quote_01.png",
    alt: "Frase de Satoru Gojo sobre el amor, Jujutsu Kaisen",
    rotate: -6,
    translateY: 20,
  },
  {
    src: "/images/quote_02.png",
    alt: "Frase de Wasuke Itadori sobre ayudar, Jujutsu Kaisen",
    rotate: 5,
    translateY: -10,
  },
];

export default function ShareShowcase() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-bgDark via-surface/10 to-bgDark" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#FF6B8A]/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Comparte
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-textPrimary mb-6 leading-tight">
              Cada frase,{" "}
              <span className="text-gradient">una obra de arte</span>
            </h2>
            <p className="text-textSecondary text-lg leading-relaxed mb-8">
              Genera una tarjeta visual con gradiente, comilla decorativa, autor
              y anime. Compártela en WhatsApp, Instagram, Twitter o donde
              quieras — todo desde la app, sin editores externos.
            </p>

            <ul className="space-y-3">
              {[
                "Diseño único por frase con arte del anime",
                "Formato vertical listo para stories",
                "Marca de agua @quoteanime incluida",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-textSecondary"
                >
                  <span className="text-accent mt-0.5 shrink-0">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Cards column */}
          <div className="relative h-[480px] md:h-[540px] flex items-center justify-center">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.src}
                initial={{
                  opacity: 0,
                  y: 60,
                  rotate: card.rotate * 2,
                }}
                whileInView={{
                  opacity: 1,
                  y: card.translateY,
                  rotate: card.rotate,
                }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
                whileHover={{
                  rotate: 0,
                  y: card.translateY - 10,
                  scale: 1.05,
                  zIndex: 10,
                  transition: { duration: 0.3 },
                }}
                className="absolute"
                style={{
                  left: i === 0 ? "15%" : "auto",
                  right: i === 1 ? "15%" : "auto",
                  zIndex: i === 0 ? 2 : 1,
                }}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-accent/20 glow-purple-sm">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={260}
                    height={325}
                    className="w-[220px] sm:w-[260px] h-auto block"
                  />
                </div>
              </motion.div>
            ))}

            {/* Floating dots for visual interest */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-6 right-8 w-3 h-3 rounded-full bg-accent/50 blur-sm"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute bottom-8 left-4 w-2 h-2 rounded-full bg-[#FF6B8A]/60 blur-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
