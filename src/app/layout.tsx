import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quoteanime.app"),
  title: "Quote Anime — Frases del universo anime",
  description:
    "Frases motivacionales del universo anime para Android. Notificaciones, widget, favoritos y más. iOS próximamente.",
  openGraph: {
    title: "Quote Anime",
    description: "Frases del universo anime en tu pantalla cada día.",
    url: "https://quoteanime.app",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quote Anime",
    description: "Frases motivacionales del universo anime.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-inter antialiased">{children}</body>
    </html>
  );
}
