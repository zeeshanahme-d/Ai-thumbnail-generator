import { useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { motion, useInView } from "motion/react";
import Eyebrow from "../../../components/Eyebrow";
import { fadeUp, STAGGER, VIEWPORT } from "../../../lib/motion";
import type { CapabilityTileProps } from "../../../types";

// One bento tile: a live demo of the control on top, what it does underneath.
// The demo plays by itself only while the tile is on screen and nobody is pointing at or tabbing through it.
export default function CapabilityTile({ capability, demo: Demo, index, className = "" }: CapabilityTileProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const handlePointer = (hovered: boolean) => (event: PointerEvent) => {
    if (event.pointerType === "mouse") setIsHovered(hovered);
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
  };

  return (
    <motion.article
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      custom={index * STAGGER}
      onPointerEnter={handlePointer(true)}
      onPointerLeave={handlePointer(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={handleBlur}
      className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-background-card shadow-card transition-[border-color] duration-200 hover:border-border-strong ${className}`}
    >
      <div className="flex flex-1 flex-col border-b border-border bg-background-surface p-4 sm:p-5">
        <Demo active={inView && !isHovered && !hasFocus} />
      </div>
      <div className="p-5 sm:p-6">
        <Eyebrow>{capability.label}</Eyebrow>
        <h3 className="mt-3 text-xl font-medium leading-snug tracking-[-0.02em] text-text-primary">
          {capability.title}
        </h3>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-text-secondary">
          {capability.description}
        </p>
      </div>
    </motion.article>
  );
}
