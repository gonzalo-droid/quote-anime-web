import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AppShowcase from "@/components/AppShowcase";
import FAQ from "@/components/FAQ";
import Download from "@/components/Download";
import Footer from "@/components/Footer";
import StickyDownloadBar from "@/components/StickyDownloadBar";
import {
  PLAY_STORE_URL,
  APP_STORE_URL,
  INSTAGRAM_URL,
  SITE_URL,
} from "@/lib/constants";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Quote Anime",
    operatingSystem: "ANDROID, IOS",
    applicationCategory: "LifestyleApplication",
    url: SITE_URL,
    downloadUrl: PLAY_STORE_URL,
    sameAs: [APP_STORE_URL, INSTAGRAM_URL],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Frases motivacionales del universo anime para Android e iOS. Notificaciones, widget, favoritos y más.",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero />
      <AppShowcase />
      <FAQ />
      <Download />
      <Footer />
      <StickyDownloadBar />
    </main>
  );
}
