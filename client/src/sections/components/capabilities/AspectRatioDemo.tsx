import { motion } from "motion/react";
import Button from "../../../components/Button";
import { ASPECT_RATIOS } from "../../../data/generator";
import { DURATION, EASE_OUT } from "../../../lib/motion";
import { useAutoCycle } from "../../../lib/useAutoCycle";
import type { CapabilityDemoProps } from "../../../types";

const layoutTransition = { layout: { duration: DURATION.line, ease: EASE_OUT } };

// A frame that reshapes to each aspect ratio. The stage is a size container, so the frame
// fills whichever side runs out first: width min(100% of the stage, its height × ratio).
export default function AspectRatioDemo({ active }: CapabilityDemoProps) {
  const [index, select] = useAutoCycle(ASPECT_RATIOS.length, { active });
  const { value, label, ratio } = ASPECT_RATIOS[index];
  const [width, height] = value.split(":").map(Number);

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* A size container has no content height of its own, so it needs a min-height; flex-1 grows it in tall tiles. */}
      <div className="grid min-h-60 flex-1 place-items-center @container-size sm:min-h-72">
        <motion.div
          layout
          transition={layoutTransition}
          style={{ aspectRatio: ratio, width: `min(100cqw, ${(width / height) * 100}cqh)` }}
          className="relative overflow-hidden rounded-lg border border-border-strong"
        >
          <motion.img
            layout
            transition={layoutTransition}
            src="/assets/thumb_1.jpg"
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
          <motion.span
            layout="position"
            transition={layoutTransition}
            className="absolute left-2 top-2 rounded-md bg-black/65 px-2 py-1 font-mono text-[11px] text-white"
          >
            {value} · {label}
          </motion.span>
        </motion.div>
      </div>

      <div role="group" aria-label="Aspect ratio" className="flex flex-wrap gap-2">
        {ASPECT_RATIOS.map((option, optionIndex) => (
          <Button
            key={option.value}
            type="button"
            size="xs"
            fullWidth={false}
            variant={optionIndex === index ? "inverse" : "secondary"}
            aria-pressed={optionIndex === index}
            onClick={() => select(optionIndex)}
            className="font-mono tabular-nums"
          >
            {option.value}
          </Button>
        ))}
      </div>
    </div>
  );
}
