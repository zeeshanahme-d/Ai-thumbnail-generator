import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../../sections/HeroSection";
import CapabilitiesSection from "../../sections/CapabilitiesSection";
import ProcessSection from "../../sections/ProcessSection";
import TestimonialSection from "../../sections/TestimonialSection";
import PricingSection from "../../sections/PricingSection";
import CTASection from "../../sections/CTASection";

export default function HomePage() {
  const { hash } = useLocation();

  // Router navigation does not scroll to a hash, so links like /#pricing do it here.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <main className="flex-1 flex flex-col">
      <HeroSection />
      <CapabilitiesSection />
      <ProcessSection />
      <TestimonialSection />
      <PricingSection />
      {/* <ContactSection /> */}
      <CTASection />
    </main>
  );
}
