import { AnimatePresence, motion } from "motion/react";
import type { AnimatedValueProps } from "../types";

// Slides a new value in when it changes, e.g. a price. Screen readers get the plain value.
export default function AnimatedValue({ value, className = "" }: AnimatedValueProps) {
    return (
        <span className={`relative inline-flex ${className}`}>
            <span className="sr-only">{value}</span>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={value}
                    aria-hidden="true"
                    initial={{ y: "40%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-40%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
