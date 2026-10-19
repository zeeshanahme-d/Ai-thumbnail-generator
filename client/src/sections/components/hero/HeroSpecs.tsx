import { motion } from "motion/react";
import { heroSpecs } from "../../../data/hero";
import { fadeUp, STAGGER } from "../../../lib/motion";
import type { HeroSpecsProps } from "../../../types";

// The generator's facts as a spec sheet next to the prompt box.
export default function HeroSpecs({ delay = 0, className = "" }: HeroSpecsProps) {
  return (
    <dl className={`border-t border-border ${className}`}>
      {heroSpecs.map(({ label, value, note }, index) => (
        <motion.div
          key={label}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={delay + index * STAGGER}
          className="flex items-baseline justify-between gap-4 border-b border-border py-3"
        >
          <dt className="font-mono text-xs uppercase tracking-[0.06em] text-text-muted">{label}</dt>
          <dd className="text-right">
            <span className="font-mono text-[0.8125rem] tabular-nums text-text-primary">{value}</span>
            {note && <span className="mt-0.5 block text-xs text-text-muted">{note}</span>}
          </dd>
        </motion.div>
      ))}
    </dl>
  );
}
