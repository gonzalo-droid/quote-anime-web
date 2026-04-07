import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/constants";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-accent/10 bg-surface/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-bgDark border border-accent/20 flex items-center justify-center">
              <Image
                src="/images/logo_white.png"
                alt="Quote Anime Logo"
                width={140}
                height={56}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
            <span className="font-semibold text-textPrimary">Frases Anime</span>
          </div>

          {/* Links */}
          <nav
            className="flex flex-wrap justify-center gap-x-8 gap-y-2"
            aria-label="Footer navigation"
          >
            <Link
              href="/privacy-policy"
              className="text-textSecondary hover:text-accent text-sm transition-colors duration-200"
            >
              Política de Privacidad
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-textSecondary hover:text-accent text-sm transition-colors duration-200"
            >
              Contacto
            </a>
          </nav>

          {/* Platform note */}
          <p className="text-textSecondary text-xs text-center">
            Quote Anime está disponible para Android. <br />
            Versión iOS en desarrollo.
          </p>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-accent/10" />

          {/* Copyright */}
          <p className="text-textSecondary text-xs">
            © {new Date().getFullYear()} NekoDojo. Todos los derechos
            reservados.
          </p>

          {/* Decorative tagline */}
          <p className="text-textSecondary/60 text-xs">
            Hecho con ❤️ para los fans del anime
          </p>
        </div>
      </div>
    </footer>
  );
}
