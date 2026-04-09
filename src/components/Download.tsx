"use client";

import { motion } from "framer-motion";
import { PLAY_STORE_URL, INSTAGRAM_URL } from "@/lib/constants";
import Image from "next/image";


export default function Download() {
  return (
    <section id="download" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-bgDark via-[#0F0A2E]/30 to-bgDark pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            Descarga
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">
            Disponible ahora
          </h2>
          <p className="text-textSecondary mb-12 text-lg">
            Únete a los fans del anime que reciben su dosis de inspiración cada día.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-8"
        >
          {/* Google Play badge */}
          <div className="flex flex-col items-center gap-3">
            <motion.a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="block"
              aria-label="Descargar en Google Play"
            >
              <div className="bg-surface border border-accent/20 hover:border-accent/50 rounded-2xl px-6 py-4 flex items-center gap-4 transition-colors duration-200 glow-purple-sm">
                  <Image
                                            src="/images/google_play_store.png"
                                            alt="Quote Anime Logo"
                                            width={30}
                                            height={30}
                                            className="w-auto object-contain"
                                            priority
                                          />
                <div className="text-left">
                  <p className="text-textSecondary text-xs leading-none mb-1">Disponible en</p>
                  <p className="text-textPrimary font-semibold text-lg leading-none">Google Play</p>
                </div>
              </div>
            </motion.a>
            <span className="text-textSecondary text-sm">Gratis · Android 7.0+</span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-20 w-px bg-accent/10" />

          {/* App Store badge (disabled) */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="opacity-40 cursor-not-allowed select-none"
              aria-label="App Store - Próximamente"
              title="iOS — Próximamente"
            >
              <div className="bg-surface border border-textSecondary/20 rounded-2xl px-6 py-4 flex items-center gap-4 grayscale">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-textSecondary" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <p className="text-textSecondary text-xs leading-none mb-1">Próximamente en</p>
                  <p className="text-textPrimary font-semibold text-lg leading-none">App Store</p>
                </div>
              </div>
            </div>
            <span className="text-textSecondary text-sm">iOS — Próximamente</span>
          </div>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-textSecondary text-sm max-w-md mx-auto"
        >
          Actualmente disponible para Android. Estamos trabajando en la versión
          para iOS, ¡pronto en el App Store!
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex justify-center"
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-textSecondary hover:text-accent transition-colors duration-200 text-sm"
            aria-label="Síguenos en Instagram"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Síguenos en Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
