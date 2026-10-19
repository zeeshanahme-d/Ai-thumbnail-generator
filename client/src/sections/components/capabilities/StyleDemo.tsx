import { AnimatePresence, motion } from "motion/react";
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import { THUMBNAIL_STYLES } from "../../../data/generator";
import { crossFade } from "../../../lib/motion";
import { useAutoCycle } from "../../../lib/useAutoCycle";
import type { CapabilityDemoProps } from "../../../types";

// The style presets as chips, with the selected preset's description underneath.
export default function StyleDemo({ active }: CapabilityDemoProps) {
  const [index, select] = useAutoCycle(THUMBNAIL_STYLES.length, { active });
  const selected = THUMBNAIL_STYLES[index];

  return (
    <div className="flex flex-1 flex-col justify-between gap-5">
      <div role="group" aria-label="Style preset" className="flex flex-wrap gap-2">
        {THUMBNAIL_STYLES.map((style, styleIndex) => (
          <Button
            key={style.label}
            type="button"
            size="xs"
            fullWidth={false}
            variant={styleIndex === index ? "inverse" : "secondary"}
            aria-pressed={styleIndex === index}
            onClick={() => select(styleIndex)}
          >
            {style.label}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-background-card p-4">
        <Eyebrow>Preset {String(index + 1).padStart(2, "0")}</Eyebrow>
        {/* A fixed height keeps the tile still while descriptions of different lengths swap. */}
        <div className="mt-2 h-24">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={selected.label} variants={crossFade} initial="hidden" animate="visible" exit="exit">
              <p className="text-base font-medium text-text-primary">{selected.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{selected.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
