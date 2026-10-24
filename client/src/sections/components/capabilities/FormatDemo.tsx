import { motion } from "motion/react";
import Button from "../../../components/Button";
import { THUMBNAIL_FORMATS } from "../../../data/generator";
import { DURATION, EASE_OUT } from "../../../lib/motion";
import { useAutoCycle } from "../../../lib/useAutoCycle";
import type { CapabilityDemoProps } from "../../../types";

const layoutTransition = { layout: { duration: DURATION.line, ease: EASE_OUT } };

// Picked so that every step changes the frame's shape.
const DEMO_VALUES = new Set(["youtube", "tiktok", "instagram-post", "instagram-story", "twitch", "square"]);
const DEMO_FORMATS = THUMBNAIL_FORMATS.filter(({ value }) => DEMO_VALUES.has(value));

// A frame that reshapes to each platform's format. The stage is a size container, so the frame
// fills whichever side runs out first: width min(100% of the stage, its height × ratio).
export default function FormatDemo({ active }: CapabilityDemoProps) {
  const [index, select] = useAutoCycle(DEMO_FORMATS.length, { active });
  const { name, aspectRatio } = DEMO_FORMATS[index];
  const [width, height] = aspectRatio.split(":").map(Number);

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* A size container has no content height of its own, so it needs a min-height; flex-1 grows it in tall tiles. */}
      <div className="grid min-h-60 flex-1 place-items-center @container-size sm:min-h-72">
        <motion.div
          layout
          transition={layoutTransition}
          style={{ aspectRatio: `${width} / ${height}`, width: `min(100cqw, ${(width / height) * 100}cqh)` }}
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
            className="absolute left-2 top-2 whitespace-nowrap rounded-md bg-black/65 px-2 py-1 font-mono text-[11px] text-white"
          >
            {aspectRatio} · {name}
          </motion.span>
        </motion.div>
      </div>

      <div role="group" aria-label="Platform" className="flex flex-wrap gap-2">
        {DEMO_FORMATS.map((format, formatIndex) => (
          <Button
            key={format.value}
            type="button"
            size="xs"
            fullWidth={false}
            variant={formatIndex === index ? "inverse" : "secondary"}
            aria-pressed={formatIndex === index}
            onClick={() => select(formatIndex)}
          >
            {format.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
