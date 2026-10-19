import type Lenis from "lenis";

// The homepage's Lenis instance while it is mounted (pages/home/components/SmoothScroll).
// Only a type is imported here, so Lenis itself stays out of the main bundle.
let lenis: Lenis | null = null;

export function setSmoothScroll(instance: Lenis | null) {
    lenis = instance;
}

// Scrolls to an in-page anchor such as "#pricing". The target's scroll-margin-top (scroll-mt-*)
// keeps it clear of the sticky navbar on both paths: Lenis when it runs, native scrolling otherwise.
// `instant` is for arriving on the page: a smooth scroll started then would be cut off when
// Lenis loads a moment later and switches scroll-behavior off.
export function scrollToHash(hash: string, { instant = false } = {}) {
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;

    if (lenis) {
        // Lenis applies the target's scroll-margin-top itself.
        lenis.scrollTo(target, { immediate: instant });
        return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: instant || reduceMotion ? "auto" : "smooth" });
}
