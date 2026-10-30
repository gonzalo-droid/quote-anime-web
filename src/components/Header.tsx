"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-accent/10 bg-canvas/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/logo.png"
            alt="Quote Anime Logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-[10px] object-cover"
            priority
          />
          <span className="font-semibold text-textPrimary group-hover:text-accent transition-colors duration-200">
            Quote Anime
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <motion.a
            href="#download"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 bg-accent text-canvas hover:opacity-90 font-semibold text-sm px-4 py-2 rounded-lg transition-opacity duration-200"
          >
            Descargar
          </motion.a>
        </div>
      </div>
    </header>
  );
}
