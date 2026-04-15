import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ShareShowcase from "@/components/ShareShowcase";
import Screenshots from "@/components/Screenshots";
import Download from "@/components/Download";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <ShareShowcase />
      <Screenshots />
      <Download />
      <Footer />
    </main>
  );
}
