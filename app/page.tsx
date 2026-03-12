"use client"

import HeroSection from "@/components/home/hero-section";
import FeatureSection from "@/components/home/feature-section";
import AppShowcaseSection from "@/components/home/app-showcase-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import CTASection from "@/components/home/cta-section";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import ArticlesSection from "@/components/home/articles-section";
import PricingSection from "@/components/home/pricing-section";
import { StickyDownload } from "@/components/layout/sticky-download";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash

    if (hash.includes("type=recovery")) {
      window.location.replace("/reset-password" + hash)
    }
  }, [])
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <AppShowcaseSection />
      <PricingSection />
      <TestimonialsSection />
      <ArticlesSection />
      <CTASection />
      <Footer />
      <StickyDownload />
    </main>
  );
}
