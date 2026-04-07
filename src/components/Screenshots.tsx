"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function PhoneMockup({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="relative"
    >
      {/* Phone frame */}
      <div className="relative mx-auto w-[160px] bg-[#0A0A1A] rounded-[2.5rem] border-2 border-accent/20 shadow-2xl overflow-hidden"
        style={{ height: "320px" }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#0A0A1A] rounded-b-xl z-10" />
        {/* Screen */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.4rem]">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function ScreenMain() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0F0A2E] to-[#1A0A2E] flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#7C3AED]/10 to-transparent" />
      <div className="text-center">
        <p className="font-playfair italic text-[10px] text-textPrimary leading-relaxed mb-4 opacity-90">
          &ldquo;Si no puedes soportar lo que eres, cambia.&rdquo;
        </p>
        <p className="text-[8px] text-accent">— Levi Ackerman</p>
        <p className="text-[7px] text-textSecondary">Attack on Titan</p>
      </div>
      <div className="absolute bottom-8 flex gap-4">
        <div className="w-5 h-5 rounded-full bg-heart/20 border border-heart/40 flex items-center justify-center">
          <span className="text-[8px]">❤️</span>
        </div>
        <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
          <span className="text-[8px]">📤</span>
        </div>
      </div>
    </div>
  );
}

function ScreenCatalog() {
  const categories = ["Naruto", "AOT", "Demon", "One P."];
  const quotes = [
    { a: "Naruto", t: "El poder de proteger..." },
    { a: "Violet E.", t: "El futuro pertenece..." },
    { a: "Levi", t: "Si no puedes..." },
  ];

  return (
    <div className="w-full h-full bg-bgDark flex flex-col pt-6 px-3">
      <p className="text-[8px] font-semibold text-textPrimary mb-3">Explorar</p>
      <div className="flex gap-1.5 mb-3 overflow-hidden">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`text-[6px] px-2 py-0.5 rounded-full whitespace-nowrap ${
              cat === "Naruto"
                ? "bg-accent text-bgDark font-semibold"
                : "bg-surface border border-accent/20 text-textSecondary"
            }`}
          >
            {cat}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {quotes.map((q, i) => (
          <div key={i} className="bg-surface rounded-xl p-2 border border-accent/10">
            <p className="text-[7px] text-textSecondary mb-0.5">{q.a}</p>
            <p className="text-[7px] text-textPrimary font-playfair italic">{q.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenSettings() {
  const items = [
    { icon: "🔔", label: "Notificaciones", value: "08:00" },
    { icon: "🖼️", label: "Widget", value: "Grande" },
    { icon: "🌙", label: "Tema", value: "Oscuro" },
  ];

  return (
    <div className="w-full h-full bg-bgDark flex flex-col pt-6 px-3">
      <p className="text-[8px] font-semibold text-textPrimary mb-4">Ajustes</p>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between bg-surface rounded-xl px-3 py-2 border border-accent/10"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px]">{item.icon}</span>
              <span className="text-[7px] text-textPrimary">{item.label}</span>
            </div>
            <span className="text-[6px] text-accent font-medium">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <div className="bg-accent/10 border border-accent/20 rounded-lg px-3 py-1.5">
          <p className="text-[6px] text-accent text-center">v1.1.0</p>
        </div>
      </div>
    </div>
  );
}

export default function Screenshots() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0A2E]/50 to-bgDark pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              La app
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-textPrimary mb-6">
              Diseñada para{" "}
              <span className="text-gradient">inspirarte</span>
            </h2>
            <p className="text-textSecondary text-lg leading-relaxed mb-8 max-w-md lg:max-w-none">
              Desliza, descubre, inspírate. Cada frase del universo anime
              seleccionada para motivarte en tu día a día.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: "✦", text: "Interfaz fluida e intuitiva" },
                { icon: "✦", text: "Actualización de frases vía la nube" },
                { icon: "✦", text: "Widget personalizable en 3 tamaños" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 justify-center lg:justify-start">
                  <span className="text-accent text-sm">{item.icon}</span>
                  <span className="text-textSecondary text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mockups side */}
          <div className="flex-1 flex items-end justify-center gap-4 md:gap-6">
            <div className="translate-y-6">
              <PhoneMockup delay={0.1}>
                <ScreenCatalog />
              </PhoneMockup>
            </div>
            <div className="-translate-y-2">
              <PhoneMockup delay={0}>
                <ScreenMain />
              </PhoneMockup>
            </div>
            <div className="translate-y-6 hidden sm:block">
              <PhoneMockup delay={0.2}>
                <ScreenSettings />
              </PhoneMockup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
