import { motion } from "motion/react";
import { fadeUp, VIEWPORT } from "../lib/motion";
import type { RevealProps } from "../types";

// Fades content up into place the first time it scrolls into view.
export default function Reveal({ children, delay = 0, className }: RevealProps) {
    return (
        <motion.div
            className={className}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            custom={delay}
        >
            {children}
        </motion.div>
    );
}
