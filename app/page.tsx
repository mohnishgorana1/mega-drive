// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import HeroSection from "@/components/home_components/HeroSection";
import FeaturesSection from "@/components/home_components/FeaturesSection";
import Footer from "@/components/home_components/FooterSection";
import HowItWorksSection from "@/components/home_components/HowItWorksSection";
import CallToActionSection from "@/components/home_components/CallToAction";
import PricingSection from "@/components/home_components/PricingSection";
import TestimonialSection from "@/components/home_components/TestimonialsSection";
import FaqSection from "@/components/home_components/FaqSection";

export default function HomePage() {
  const { userId } = auth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Header />

      {/* 🌌 BACKGROUND EFFECTS (Kept here as they span across sections) */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-indigo-600/10 blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60vw] h-[20vw] rounded-full bg-cyan-500/5 blur-[150px]" />
      </div>

      {/* 🚀 MAIN CONTENT AREA */}
      <main>
        <HeroSection userId={userId} />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialSection />
        <PricingSection userId={userId} />
        <FaqSection />
        <CallToActionSection userId={userId} />
      </main>

      <Footer />
    </div>
  );
}

