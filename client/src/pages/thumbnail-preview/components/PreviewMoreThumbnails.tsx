import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { STYLE_DOTS } from "../../../data/community";
import { getThumbnailImageUrl, getThumbnailAuthorName } from "../../../lib/thumbnail";
import type { Thumbnail } from "../../../types";
import type { PreviewSource } from "../_types";

interface PreviewMoreThumbnailsProps {
  thumbnails: Thumbnail[];
  style: string;
  source: PreviewSource;
}

export default function PreviewMoreThumbnails({
  thumbnails,
  style,
  source,
}: PreviewMoreThumbnailsProps) {
  const navigate = useNavigate();
  const dot = STYLE_DOTS[style];

  if (thumbnails.length === 0) return null;

  const handleClick = (thumbnail: Thumbnail) => {
    navigate(`/thumbnail/${thumbnail._id}`, {
      state: { thumbnail, source },
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-text-primary">
          More{" "}
          {dot && (
            <span className={`inline-block size-2 rounded-full ${dot} mx-1`} />
          )}
          {style} Thumbnails
        </h2>
        <Link
          to="/community"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          See all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {thumbnails.slice(0, 4).map((thumbnail, index) => {
          const imageUrl = getThumbnailImageUrl(thumbnail);
          const authorName = getThumbnailAuthorName(thumbnail);
          const thumbDot = STYLE_DOTS[thumbnail.style ?? ""] || "bg-gray-400";

          return (
            <motion.button
              key={thumbnail._id}
              type="button"
              onClick={() => handleClick(thumbnail)}
              className="group text-left overflow-hidden rounded-xl border border-border bg-background-card transition-all hover:-translate-y-0.5 hover:shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: index * 0.07,
                type: "spring",
                stiffness: 300,
                damping: 70,
              }}
            >
              <div className="relative aspect-video overflow-hidden bg-background-surface-2">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={thumbnail.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-text-muted text-xs">
                    No image
                  </div>
                )}
                {thumbnail.style && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                    <span className={`size-1.5 rounded-full ${thumbDot}`} />
                    {thumbnail.style}
                  </span>
                )}
              </div>

              <div className="p-2">
                <p className="line-clamp-1 text-xs font-medium text-text-primary">
                  {thumbnail.title}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-text-muted">
                  {authorName}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
