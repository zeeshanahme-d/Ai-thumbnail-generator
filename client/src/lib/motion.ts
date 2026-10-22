import type { Transition, Variants } from "motion/react";

// Motion tokens for the pages that animate (the homepage and /pricing). Reuse these instead of
// inventing new timings, so every entrance shares one easing family and one rhythm.

/** Entrance easing; `ease-out-expo` in CSS is the same curve. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Seconds. Exits are faster than entrances; hover lives in CSS at 150–250ms. */
export const DURATION = {
    small: 0.5,
    enter: 0.7,
    line: 0.8,
    exit: 0.25,
} as const;

/** Delay between siblings that enter together. */
export const STAGGER = 0.06;

/** How far content travels as it fades in, in px. */
export const DISTANCE = 16;

/** Trigger a little before the element is fully on screen, and only once. */
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

export const enterTransition = (delay = 0, duration: number = DURATION.enter): Transition => ({
    duration,
    delay,
    ease: EASE_OUT,
});

/** Fade up into place. Pass the delay as `custom`. */
export const fadeUp: Variants = {
    hidden: { opacity: 0, y: DISTANCE },
    visible: (delay: number = 0) => ({ opacity: 1, y: 0, transition: enterTransition(delay) }),
};

/** Swap one piece of text or UI for another in place (AnimatePresence). */
export const crossFade: Variants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: enterTransition(0, DURATION.small) },
    exit: { opacity: 0, y: -6, transition: { duration: DURATION.exit, ease: EASE_OUT } },
};
