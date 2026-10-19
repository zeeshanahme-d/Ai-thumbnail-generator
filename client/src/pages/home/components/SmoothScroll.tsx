import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "../../../lib/gsap";
import { setSmoothScroll } from "../../../lib/smoothScroll";

// Smooth wheel scrolling on the homepage. Lenis runs on GSAP's ticker so it and ScrollTrigger
// share one frame loop. HomePage lazy-loads this only where RICH_MOTION_QUERY matches.
export default function SmoothScroll() {
    useEffect(() => {
        // allowNestedScroll lets inner scroll areas (the prompt textarea) keep the wheel.
        const lenis = new Lenis({ autoRaf: false, allowNestedScroll: true });
        const tick = (seconds: number) => lenis.raf(seconds * 1000);

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        setSmoothScroll(lenis);

        return () => {
            setSmoothScroll(null);
            gsap.ticker.remove(tick);
            gsap.ticker.lagSmoothing(500, 33);
            lenis.destroy();
        };
    }, []);

    return null;
}
