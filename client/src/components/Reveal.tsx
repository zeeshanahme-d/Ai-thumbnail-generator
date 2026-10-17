import { motion } from "motion/react";
import type { RevealProps } from "../types";

// Slides content up into place the first time it scrolls into view.
export default function Reveal({ children, delay = 0, className }: RevealProps) {
    return (
        <motion.div
            className={className}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
            {children}
        </motion.div>
    );
}
