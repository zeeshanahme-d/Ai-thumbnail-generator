import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface AutoCycleOptions {
    /** Advance only while true, e.g. while on screen and not hovered. */
    active: boolean;
    intervalMs?: number;
    /** Where it starts, and where it stays with reduced motion on. */
    start?: number;
}

// Steps through `count` options on a timer while `active`. Once the user picks one
// with `select`, it stops for good. With reduced motion on it never moves by itself.
export function useAutoCycle(count: number, { active, intervalMs = 2400, start = 0 }: AutoCycleOptions) {
    const reduceMotion = useReducedMotion();
    const [index, setIndex] = useState(start);
    const [isManual, setIsManual] = useState(false);
    const isCycling = active && !isManual && !reduceMotion;

    useEffect(() => {
        if (!isCycling) return;
        const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), intervalMs);
        return () => window.clearInterval(timer);
    }, [isCycling, count, intervalMs]);

    const select = (next: number) => {
        setIsManual(true);
        setIndex(next);
    };

    return [index, select] as const;
}
