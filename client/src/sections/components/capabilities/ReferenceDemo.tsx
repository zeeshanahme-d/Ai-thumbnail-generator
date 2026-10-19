import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, ImageIcon, Upload } from "lucide-react";
import { ACCEPTED_IMAGE_LABEL, MAX_IMAGE_SIZE_MB } from "../../../lib/imageValidation";
import { crossFade } from "../../../lib/motion";
import { useAutoCycle } from "../../../lib/useAutoCycle";
import type { CapabilityDemoProps } from "../../../types";

// The reference drop zone, with an image attaching and detaching on a loop.
// It illustrates the upload in the generator; it isn't an input itself.
export default function ReferenceDemo({ active }: CapabilityDemoProps) {
  const [step] = useAutoCycle(2, { active, intervalMs: 2800, start: 1 });
  const isAttached = step === 1;

  return (
    <div aria-hidden="true" className="flex flex-1 flex-col gap-3">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-background-card px-4 py-8 text-center">
        <Upload size={18} className="text-text-muted" />
        <p className="text-sm text-text-primary">Drop a face, logo or product</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-text-muted">
          {ACCEPTED_IMAGE_LABEL} · up to {MAX_IMAGE_SIZE_MB} MB
        </p>
      </div>

      <div className="h-14">
        <AnimatePresence initial={false}>
          {isAttached && (
            <motion.div
              variants={crossFade}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex h-14 items-center gap-3 rounded-lg border border-border bg-background-card px-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background-surface-2 text-text-muted">
                <ImageIcon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-text-primary">my-face.png</span>
                <span className="block font-mono text-[11px] text-text-muted">1.4 MB</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                <CircleCheck size={14} className="text-success" />
                Attached
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
