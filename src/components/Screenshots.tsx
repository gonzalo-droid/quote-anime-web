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
      initial={{ opacity: 0, x: 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      <Image
        src={src}
        alt={alt}
        width={160}
        height={320}
        className="w-[180px] md:w-[220px] h-auto drop-shadow-2xl"
      />
    </motion.div>
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

          {/* Screenshots side */}
          <div className="flex-1 flex items-end justify-center gap-3 md:gap-5">
            <PhoneImage
              src="/images/splash_app.png"
              alt="Pantalla de inicio"
              delay={0.1}
              className="translate-y-8 hidden sm:block"
            />
            <PhoneImage
              src="/images/onboarding_app.png"
              alt="Onboarding"
              delay={0.2}
              className="translate-y-3"
            />
            <PhoneImage
              src="/images/quote_app.png"
              alt="Frase del día"
              delay={0}
              className="-translate-y-3"
            />
            <PhoneImage
              src="/images/setting_app.png"
              alt="Ajustes"
              delay={0.3}
              className="translate-y-3 hidden sm:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
