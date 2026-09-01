import { motion } from "motion/react";
import { Sparkles, Loader2 } from "lucide-react";
import Skeleton from "../../../../components/Skeleton";

export default function GenerationSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-background-card p-6 shadow-xl"
    >
      {/* Ambient glowing effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl animate-pulse"
      />

      <div className="flex flex-col items-center text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles size={13} className="animate-spin" />
          AI Studio Generating Thumbnail...
        </div>

        {/* Big Aspect Video Skeleton Preview */}
        <div className="relative mt-6 aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-background-surface-2">
          <Skeleton className="h-full w-full" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary shadow-inner">
              <Loader2 size={28} className="animate-spin" />
            </div>
            <h4 className="text-base font-semibold text-text-primary">
              Crafting High-CTR Thumbnail
            </h4>
            <p className="max-w-sm text-xs text-text-secondary">
              Analyzing prompt, applying styling parameters, balancing lighting & contrast, and generating in 4K resolution...
            </p>
          </div>
        </div>

        {/* Progress skeleton bars */}
        <div className="mt-6 flex w-full max-w-md flex-col gap-2">
          <div className="flex justify-between text-xs text-text-muted">
            <span>Model Processing (Gemini AI)</span>
            <span className="text-primary font-medium">Please wait...</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-background-surface-2">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="h-full w-1/2 rounded-full bg-linear-to-r from-primary/30 via-primary to-primary/30"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
