import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface TypewriterOptions {
    /** Freeze where it is, e.g. while off screen. */
    paused?: boolean;
    /** Stop and show the current text in full, e.g. once the user takes over. */
    stopped?: boolean;
    typeMs?: number;
    eraseMs?: number;
    holdMs?: number;
}

// Types each text out, holds it, erases it and moves on to the next, looping.
// With reduced motion on, it shows the first text in full and never moves.
export function useTypewriter(
    texts: readonly string[],
    { paused = false, stopped = false, typeMs = 32, eraseMs = 10, holdMs = 2200 }: TypewriterOptions = {},
) {
    const reduceMotion = useReducedMotion();
    const [{ index, length, erasing }, setState] = useState({ index: 0, length: 0, erasing: false });
    const isStill = stopped || Boolean(reduceMotion);
    const text = texts[index] ?? "";

    useEffect(() => {
        if (isStill || paused) return;

        const [delay, next] = !erasing
            ? length < text.length
                ? [typeMs, { index, length: length + 1, erasing }]
                : [holdMs, { index, length, erasing: true }]
            : length > 0
                ? [eraseMs, { index, length: length - 1, erasing }]
                : [typeMs * 10, { index: (index + 1) % texts.length, length: 0, erasing: false }];

        const timer = window.setTimeout(() => setState(next), delay);
        return () => window.clearTimeout(timer);
    }, [isStill, paused, index, length, erasing, text.length, texts.length, typeMs, eraseMs, holdMs]);

    return isStill ? text : text.slice(0, length);
}
