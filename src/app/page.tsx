import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ShareShowcase from "@/components/ShareShowcase";
import Screenshots from "@/components/Screenshots";
import FAQ from "@/components/FAQ";
import Download from "@/components/Download";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <ShareShowcase />
      <Screenshots />
      <FAQ />
      <Download />
      <Footer />
    </main>
  );
}
