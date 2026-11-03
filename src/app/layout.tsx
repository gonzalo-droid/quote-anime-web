import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Analytics from "@/components/Analytics";
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
  metadataBase: new URL("https://animequote.app"),
  title: "AnimeQuote — Frases del universo anime",
  description:
    "Frases motivacionales del universo anime para Android e iOS. Notificaciones, widget, favoritos y más.",
  applicationName: "AnimeQuote",
  keywords: [
    "animequote",
    "anime quote",
    "anime quotes",
    "frases anime",
    "app frases anime",
    "widget anime",
    "notificaciones anime",
    "frases motivacionales anime",
  ],
  alternates: {
    canonical: "https://animequote.app",
  },
  openGraph: {
    title: "AnimeQuote",
    description: "Frases del universo anime en tu pantalla cada día.",
    url: "https://animequote.app",
    siteName: "AnimeQuote",
    type: "website",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnimeQuote",
    description: "Frases motivacionales del universo anime.",
  },
  icons: {
    icon: "/images/favicon.ico",
    apple: "/images/icon-192.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F4FF",
};

// Runs before first paint so a saved dark preference never flashes light.
const themeScript = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-inter antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
