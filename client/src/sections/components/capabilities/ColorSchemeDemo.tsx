import { AnimatePresence, motion } from "motion/react";
import Button from "../../../components/Button";
import { THUMBNAIL_STYLES_COLORS } from "../../../data/generator";
import { crossFade, DURATION, EASE_OUT } from "../../../lib/motion";
import { useAutoCycle } from "../../../lib/useAutoCycle";
import type { CapabilityDemoProps } from "../../../types";

// The selected color scheme as a palette strip with its hex values, and every scheme as a swatch.
export default function ColorSchemeDemo({ active }: CapabilityDemoProps) {
  const [index, select] = useAutoCycle(THUMBNAIL_STYLES_COLORS.length, { active });
  const selected = THUMBNAIL_STYLES_COLORS[index];

  return (
    <div className="flex flex-1 flex-col justify-between gap-5">
      <div>
        <div className="relative h-20 overflow-hidden rounded-lg border border-border">
          <AnimatePresence initial={false}>
            <motion.div
              key={selected.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.small, ease: EASE_OUT }}
              className="absolute inset-0 flex"
            >
              {selected.schemeColors.map((color) => (
                <span key={color} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-2 flex h-5 items-center justify-between font-mono text-xs text-text-muted">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={selected.label} variants={crossFade} initial="hidden" animate="visible" exit="exit" className="text-text-primary">
              {selected.label}
            </motion.span>
          </AnimatePresence>
          <span className="tabular-nums">{selected.schemeColors.join("  ")}</span>
        </div>
      </div>

      <div role="group" aria-label="Color scheme" className="flex flex-wrap gap-2">
        {THUMBNAIL_STYLES_COLORS.map((scheme, schemeIndex) => {
          const [first, second, third] = scheme.schemeColors;
          const isSelected = schemeIndex === index;

          return (
            <Button
              key={scheme.label}
              type="button"
              variant="secondary"
              size="iconSm"
              aria-label={scheme.label}
              aria-pressed={isSelected}
              onClick={() => select(schemeIndex)}
              className={isSelected ? "ring-2 ring-text-primary ring-offset-2 ring-offset-background-surface" : ""}
            >
              <span
                aria-hidden="true"
                className="size-5 rounded-full"
                style={{ background: `conic-gradient(${first} 0 33%, ${second} 0 66%, ${third} 0)` }}
              />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
