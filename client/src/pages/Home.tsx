import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import LatestSection from "@/components/LatestSection";
import CategoriesSection from "@/components/CategoriesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Phrone AI | 孚朗AI — AI Industry Insights & Analysis"
        description="AI industry insights, research analysis, and technology trends. Your trusted source for AI news and deep analysis."
        url="https://phrone.ai"
      />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedSection />
        <LatestSection />
        <CategoriesSection />
        <NewsletterSection />
      </main>
      {/* Gradient transition from page background to footer */}
      <div className="h-24 bg-gradient-to-b from-background to-[oklch(0.15_0.015_260)]" aria-hidden="true" />
      <Footer />
    </div>
  );
}
