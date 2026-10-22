import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { STYLE_DOTS } from "../../../data/community";
import { getThumbnailCardImageUrl, getThumbnailAuthorName } from "../../../lib/thumbnail";
import type { PreviewSource, Thumbnail } from "../../../types";

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
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xl font-medium tracking-[-0.015em] text-text-primary">
          {dot && <span className={`size-2 rounded-full ${dot}`} />}
          More {style} thumbnails
        </h2>
        <Link
          to={style ? `/community?style=${encodeURIComponent(style)}` : "/community"}
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          See all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {thumbnails.slice(0, 4).map((thumbnail) => {
          const imageUrl = getThumbnailCardImageUrl(thumbnail);
          const authorName = getThumbnailAuthorName(thumbnail);

          return (
            <button
              key={thumbnail._id}
              type="button"
              onClick={() => handleClick(thumbnail)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-background-card text-left shadow-card transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                  <div className="flex h-full items-center justify-center text-xs text-text-muted">
                    No image
                  </div>
                )}
              </div>

              <div className="p-3">
                <p className="line-clamp-1 text-sm font-medium text-text-primary">{thumbnail.title}</p>
                <p className="mt-0.5 truncate text-xs text-text-muted">{authorName}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
