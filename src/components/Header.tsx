"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";

export default function Header() {
  return (
    <header className="border-b border-accent/10 bg-surface/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/logo_white.png"
            alt="Quote Anime Logo"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="font-semibold text-textPrimary group-hover:text-accent transition-colors duration-200">
            Frases Anime
          </span>
        </Link>

        <nav
          className="hidden sm:flex items-center gap-8"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-textSecondary hover:text-accent text-sm font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <motion.a
          href="#download"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-1.5 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-semibold text-sm px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Descargar
        </motion.a>
      </div>
    </header>
  );
}
