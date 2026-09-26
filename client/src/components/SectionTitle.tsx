import type { SectionTitleProps } from "../types";
import { motion } from "motion/react";

// Homepage section header: optional pill, heading, description.
export default function SectionTitle({
  text1,
  text2,
  text3,
}: SectionTitleProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      {text1 && (
        <motion.span
          className="mb-5 rounded-full border border-border bg-background-card px-4 py-1.5 text-xs font-medium text-text-secondary shadow-sm"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          {text1}
        </motion.span>
      )}
      <motion.h2
        className="text-balance text-[clamp(1.875rem,1.35rem+2.25vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05, type: "spring", stiffness: 280, damping: 70, mass: 1 }}
      >
        {text2}
      </motion.h2>
      <motion.p
        className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-text-secondary sm:text-base"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 70, mass: 1 }}
      >
        {text3}
      </motion.p>
    </div>
  );
}
