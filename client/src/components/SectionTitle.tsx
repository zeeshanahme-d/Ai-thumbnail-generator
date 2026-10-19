import { motion } from "motion/react";
import Eyebrow from "./Eyebrow";
import MaskedLines from "./MaskedLines";
import { fadeUp, VIEWPORT } from "../lib/motion";
import type { SectionTitleProps } from "../types";

// Section header: optional label, heading, description. Animates in on the homepage and /pricing only.
export default function SectionTitle({
  text1,
  text2,
  text3,
  as = "h2",
  animate = true,
  align = "center",
}: SectionTitleProps) {
  const Heading = as === "h1" ? motion.h1 : motion.h2;
  const reveal = (delay: number) =>
    animate
      ? { variants: fadeUp, initial: "hidden", whileInView: "visible", viewport: VIEWPORT, custom: delay }
      : {};

  if (align === "center") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        {text1 && (
          <motion.span
            className="mb-5 rounded-full border border-border bg-background-card px-4 py-1.5 text-xs font-medium text-text-secondary shadow-sm"
            {...reveal(0)}
          >
            {text1}
          </motion.span>
        )}
        <Heading
          className="text-balance text-[clamp(1.875rem,1.35rem+2.25vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary"
          {...reveal(0.05)}
        >
          {text2}
        </Heading>
        <motion.p
          className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-text-secondary sm:text-base"
          {...reveal(0.1)}
        >
          {text3}
        </motion.p>
      </div>
    );
  }

  const lines = Array.isArray(text2) ? text2 : [text2];
  const isSplit = align === "split";

  return (
    <div className={isSplit ? "grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8" : "flex flex-col"}>
      <div className={isSplit ? "lg:col-span-7" : ""}>
        {text1 && (
          <motion.div className="mb-5" {...reveal(0)}>
            <Eyebrow>{text1}</Eyebrow>
          </motion.div>
        )}
        <Heading className="text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.035em] text-text-primary">
          {animate ? <MaskedLines lines={lines} /> : text2}
        </Heading>
      </div>
      <motion.p
        className={`max-w-[46ch] text-pretty text-base leading-relaxed text-text-secondary ${isSplit ? "lg:col-span-5 lg:justify-self-end" : "mt-5"}`}
        {...reveal(0.1)}
      >
        {text3}
      </motion.p>
    </div>
  );
}
