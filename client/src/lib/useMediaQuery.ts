import { useSyncExternalStore } from "react";

/** Wide screen, mouse or trackpad, and motion allowed: where smooth scroll and scroll-scrubbed scenes run. */
export const RICH_MOTION_QUERY =
    "(min-width: 64rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

// Whether a media query matches, kept in sync as the window, input device or OS setting changes.
export function useMediaQuery(query: string): boolean {
    return useSyncExternalStore(
        (onChange) => {
            const list = window.matchMedia(query);
            list.addEventListener("change", onChange);
            return () => list.removeEventListener("change", onChange);
        },
        () => window.matchMedia(query).matches,
    );
}
