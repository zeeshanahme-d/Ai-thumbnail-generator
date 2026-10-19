import { motion, type Variants } from "motion/react";
import { DURATION, EASE_OUT, STAGGER, VIEWPORT } from "../lib/motion";
import type { MaskedLinesProps } from "../types";

const container: Variants = {
    hidden: {},
    visible: (delay: number) => ({
        transition: { staggerChildren: STAGGER + 0.02, delayChildren: delay },
    }),
};

const line: Variants = {
    hidden: { y: "105%" },
    visible: { y: 0, transition: { duration: DURATION.line, ease: EASE_OUT } },
};

// Reveals a heading line by line, each line sliding up from behind its own mask.
// Put it inside the heading element; each entry in `lines` becomes one line.
export default function MaskedLines({ lines, trigger = "inView", delay = 0 }: MaskedLinesProps) {
    const triggerProps =
        trigger === "mount"
            ? { animate: "visible" }
            : { whileInView: "visible", viewport: VIEWPORT };

    return (
        <motion.span className="block" variants={container} initial="hidden" custom={delay} {...triggerProps}>
            {lines.map((content, index) => (
                // The extra bottom padding keeps descenders inside the mask without moving the layout.
                <span key={index} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                    <motion.span className="block" variants={line}>
                        {content}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
}
