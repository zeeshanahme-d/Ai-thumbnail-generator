import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import PromptCard from "../../../components/image-generate-components/PromptCard";
import { ThumbnailData } from "../../../data/thumbnail";
import ThumbnailCard from "../../../components/ThumbnailCard";

export default function DashboardGenerate() {
  const generations = ThumbnailData.slice(0, 6);

  return (
    <div className="px-6 py-10 md:px-10">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 70, mass: 1 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-on-primary">
          <Sparkles size={12} />
          Powered by top-tier AI.
        </span>
        <h1 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-text-primary">
          AI <span className="text-primary">Thumbnail</span> Generator
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Describe your vision, pick a style, and let the AI do the rest.
        </p>
      </motion.div>

      <div className="mx-auto mt-10 max-w-5xl">
        <PromptCard label="Your prompt" />
      </div>

      <hr className="mx-auto my-12 max-w-6xl border-border" />

      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-text-primary">
            My Generation
          </h2>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary">
            {generations.length}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {generations.map((thumbnail, index) => (
            <ThumbnailCard
              key={thumbnail._id}
              thumbnail={thumbnail}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
