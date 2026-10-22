import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import HeroSection from "../../sections/HeroSection";
import CapabilitiesSection from "../../sections/CapabilitiesSection";
import ProcessSection from "../../sections/ProcessSection";
import PricingSection from "../../sections/PricingSection";
import FaqSection from "../../sections/FaqSection";
import CTASection from "../../sections/CTASection";
import { scrollToHash } from "../../lib/smoothScroll";
import { themeFontsLoaded } from "../../lib/themeFonts";
import { RICH_MOTION_QUERY, useMediaQuery } from "../../lib/useMediaQuery";

// Lenis and GSAP load in their own chunk, only where they run, so other pages never download them.
const SmoothScroll = lazy(() => import("./components/SmoothScroll"));

export default function HomePage() {
  const { hash } = useLocation();
  const richMotion = useMediaQuery(RICH_MOTION_QUERY);

  // Router navigation does not scroll to a hash, so links like /#pricing do it here:
  // a smooth scroll for a hash link clicked on the page, a jump when the page opens on one.
  const [arrivalHash] = useState(hash);
  useEffect(() => {
    if (!hash) return;
    if (hash !== arrivalHash) {
      scrollToHash(hash);
      return;
    }

    scrollToHash(hash, { instant: true });

    // The web fonts can reflow the text above once they arrive, and scroll anchoring only partly
    // makes up for it, so land again, unless the visitor has started scrolling or clicking.
    let hasInteracted = false;
    let isCancelled = false;
    const markInteracted = () => {
      hasInteracted = true;
    };
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    events.forEach((name) => window.addEventListener(name, markInteracted, { passive: true }));

    themeFontsLoaded().then(() => {
      if (!hasInteracted && !isCancelled) scrollToHash(hash, { instant: true });
    });

    return () => {
      isCancelled = true;
      events.forEach((name) => window.removeEventListener(name, markInteracted));
    };
  }, [hash, arrivalHash]);

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
