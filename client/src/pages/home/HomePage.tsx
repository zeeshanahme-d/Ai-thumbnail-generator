import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import HeroSection from "../../sections/HeroSection";
import CapabilitiesSection from "../../sections/CapabilitiesSection";
import ProcessSection from "../../sections/ProcessSection";
import PricingSection from "../../sections/PricingSection";
import FaqSection from "../../sections/FaqSection";
import CTASection from "../../sections/CTASection";
import { scrollToHash } from "../../lib/smoothScroll";
import { RICH_MOTION_QUERY, useMediaQuery } from "../../lib/useMediaQuery";

// Lenis and GSAP load in their own chunk, only where they run, so other pages never download them.
const SmoothScroll = lazy(() => import("./components/SmoothScroll"));

export default function HomePage() {
  const { hash } = useLocation();
  const richMotion = useMediaQuery(RICH_MOTION_QUERY);

  // Router navigation does not scroll to a hash, so links like /#pricing do it here.
  useEffect(() => {
    if (hash) scrollToHash(hash);
  }, [hash]);

  return (
    // "user": with reduced motion on, transforms are skipped and content appears in place.
    <MotionConfig reducedMotion="user">
      {richMotion && (
        <Suspense fallback={null}>
          <SmoothScroll />
        </Suspense>
      )}
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <CapabilitiesSection />
        <ProcessSection />
        <PricingSection />
        <FaqSection />
        <CTASection />
      </main>
    </MotionConfig>
  );
}
