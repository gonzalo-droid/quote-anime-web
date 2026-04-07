"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

function PhoneImage({
  src,
  alt,
  delay = 0,
  className = "",
}: {
  src: string;
  alt: string;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`flex-shrink-0 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={240}
        height={480}
        className="w-[200px] sm:w-[240px] h-auto drop-shadow-2xl"
      />
    </motion.div>
  );
}

export default function Screenshots() {
  return (
    <section className="py-24 relative">
      {/* Decorative background — overflow-hidden contained here, not on the section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0A2E]/50 to-bgDark" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative max-w-6xl mx-auto flex flex-col gap-12">

        {/* — Bloque 1: texto — */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="px-6 text-center"
        >
          <span className="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            La app
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-textPrimary mb-6">
            Diseñada para{" "}
            <span className="text-gradient">inspirarte</span>
          </h2>
          <p className="text-textSecondary text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Desliza, descubre, inspírate. Cada frase del universo anime
            seleccionada para motivarte en tu día a día.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {[
              { icon: "✦", text: "Interfaz fluida e intuitiva" },
              { icon: "✦", text: "Actualización de frases vía la nube" },
              { icon: "✦", text: "Widget personalizable en 3 tamaños" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 justify-center">
                <span className="text-accent text-sm">{item.icon}</span>
                <span className="text-textSecondary text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* — Bloque 2: imágenes con scroll horizontal — */}
        {/* -mx extiende el scroll edge-to-edge; px restaura el padding visual */}
        <div className="overflow-x-auto scrollbar-none -mx-0 px-6">
          <div className="flex items-end gap-5 min-w-max px-2 pb-8">
            <PhoneImage
              src="/images/splash_app.png"
              alt="Pantalla de inicio"
              delay={0.1}
              className="translate-y-8"
            />
            <PhoneImage
              src="/images/onboarding_app.png"
              alt="Onboarding"
              delay={0.2}
              className="translate-y-4"
            />
            <PhoneImage
              src="/images/quote_app.png"
              alt="Frase del día"
              delay={0}
              className="-translate-y-2"
            />
            <PhoneImage
              src="/images/setting_app.png"
              alt="Ajustes"
              delay={0.3}
              className="translate-y-4"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
