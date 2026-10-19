import type Lenis from "lenis";

// The homepage's Lenis instance while it is mounted (pages/home/components/SmoothScroll).
// Only a type is imported here, so Lenis itself stays out of the main bundle.
let lenis: Lenis | null = null;

export function setSmoothScroll(instance: Lenis | null) {
    lenis = instance;
}

// Scrolls to an in-page anchor such as "#pricing". The target's scroll-margin-top (scroll-mt-*)
// keeps it clear of the sticky navbar on both paths: Lenis when it runs, native scrolling otherwise.
export function scrollToHash(hash: string) {
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;

    if (lenis) {
        const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        lenis.scrollTo(target, { offset: -offset });
        return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}
