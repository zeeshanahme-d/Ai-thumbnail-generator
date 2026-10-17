import type { SectionTitleProps } from "../types";
import { motion } from "motion/react";

const reveal = (y: number, delay: number, stiffness: number) => ({
  initial: { y, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true },
  transition: { delay, type: "spring" as const, stiffness, damping: 70, mass: 1 },
});

// Section header: optional pill, heading, description. Animates in on the homepage only.
export default function SectionTitle({
  text1,
  text2,
  text3,
  as = "h2",
  animate = true,
}: SectionTitleProps) {
  const Heading = as === "h1" ? motion.h1 : motion.h2;
  const motionProps = (y: number, delay: number, stiffness: number) =>
    animate ? reveal(y, delay, stiffness) : {};

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      {text1 && (
        <motion.span
          className="mb-5 rounded-full border border-border bg-background-card px-4 py-1.5 text-xs font-medium text-text-secondary shadow-sm"
          {...motionProps(30, 0, 320)}
        >
          {text1}
        </motion.span>
      )}
      <Heading
        className="text-balance text-[clamp(1.875rem,1.35rem+2.25vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary"
        {...motionProps(40, 0.05, 280)}
      >
        {text2}
      </Heading>
      <motion.p
        className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-text-secondary sm:text-base"
        {...motionProps(40, 0.1, 240)}
      >
        {text3}
      </motion.p>
    </div>
  );
}
