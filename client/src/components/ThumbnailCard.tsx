import { useState } from "react";
import { Download, Eye, Heart, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { getEngagement, STYLE_DOTS } from "../data/community";
import {
  getThumbnailAuthorName,
  getThumbnailImageUrl,
} from "../lib/thumbnail";
import type { ThumbnailCardProps } from "../types";

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-blue-500",
];

const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export default function ThumbnailCard({
  thumbnail,
  index,
}: ThumbnailCardProps) {
  const { title, style, isGenerating } = thumbnail;
  const imageUrl = getThumbnailImageUrl(thumbnail);
  const { likes, views } = getEngagement(thumbnail._id);
  const [liked, setLiked] = useState(false);

  const authorName = getThumbnailAuthorName(thumbnail);
  const dot = (style && STYLE_DOTS[style]) || "bg-gray-400";

  return (
    <motion.div
      className="group overflow-hidden rounded-2xl border border-border bg-background-card transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.18)]"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: (index % 12) * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 70,
        mass: 1,
      }}
    >
      <div className="relative aspect-video overflow-hidden bg-background-surface-2">
        {isGenerating || !imageUrl ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-text-muted">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-xs font-medium">Generating...</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {style && !isGenerating && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background-card/0 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <span className={`size-2 rounded-full ${dot}`} />
            {style}
          </span>
        )}

        {!isGenerating && imageUrl && (
          <div className="absolute right-3 top-3 flex gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="flex size-8 items-center justify-center rounded-full bg-background-card/90 text-text-secondary backdrop-blur transition hover:text-primary"
              aria-label="Download thumbnail"
            >
              <Download size={15} />
            </a>
            <button
              type="button"
              onClick={() => setLiked((prev) => !prev)}
              className="flex size-8 items-center justify-center rounded-full bg-background-card/90 text-text-secondary backdrop-blur transition hover:text-primary"
              aria-label="Like thumbnail"
            >
              <Heart
                size={15}
                className={liked ? "fill-primary text-primary" : ""}
              />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-text-primary">
          {title}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${avatarColor(authorName)}`}
          >
            {authorName.charAt(0).toUpperCase()}
          </span>
          <span className="truncate text-xs text-text-secondary">
            {authorName}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Heart
              size={13}
              className={liked ? "fill-primary text-primary" : ""}
            />
            {likes + (liked ? 1 : 0)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={13} />
            {views}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
