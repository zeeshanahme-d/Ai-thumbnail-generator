import HeroSection from "../../sections/HeroSection";
import CapabilitiesSection from "../../sections/CapabilitiesSection";
import ProcessSection from "../../sections/ProcessSection";
import FeaturesSection from "../../sections/FeaturesSection";
import TestimonialSection from "../../sections/TestimonialSection";
import PricingSection from "../../sections/PricingSection";
import ContactSection from "../../sections/ContactSection";
import CTASection from "../../sections/CTASection";

export default function HomePage() {
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
