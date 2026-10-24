import { AnimatePresence, motion } from "motion/react";
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import { THUMBNAIL_CATEGORIES } from "../../../data/generator";
import { crossFade } from "../../../lib/motion";
import { useAutoCycle } from "../../../lib/useAutoCycle";
import type { CapabilityDemoProps } from "../../../types";

// What each category asks of the AI, and every category as a chip. Starts on Gaming, not General.
export default function CategoryDemo({ active }: CapabilityDemoProps) {
  const [index, select] = useAutoCycle(THUMBNAIL_CATEGORIES.length, { active, start: 1 });
  const { label } = THUMBNAIL_CATEGORIES[index];
  const isGeneral = index === 0;

  return (
    <div className="flex flex-1 flex-col justify-between gap-5">
      <div className="rounded-lg border border-border bg-background p-4">
        <Eyebrow>Tells the AI</Eyebrow>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={label}
            variants={crossFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-2 text-[0.9375rem] leading-relaxed text-text-primary"
          >
            {isGeneral
              ? "Nothing extra: the topic alone sets the look."
              : `Use the look viewers know from popular ${label.toLowerCase()} content.`}
          </motion.p>
        </AnimatePresence>
      </div>

      <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
        {THUMBNAIL_CATEGORIES.map(({ label: option, icon: Icon }, optionIndex) => (
          <Button
            key={option}
            type="button"
            size="xs"
            fullWidth={false}
            variant={optionIndex === index ? "inverse" : "secondary"}
            aria-pressed={optionIndex === index}
            onClick={() => select(optionIndex)}
          >
            <Icon size={14} />
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
