import type { YtThumbnailProps } from "../../../types";

export default function YtThumbnail({ video, className = "rounded-xl" }: YtThumbnailProps) {
  return (
    <div className={`relative aspect-video overflow-hidden bg-neutral-800 ${className}`}>
      <img src={video.thumbnailUrl} alt={video.title} loading="lazy" className="size-full object-cover" />
      <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[11px] font-medium text-white">
        {video.duration}
      </span>
    </div>
  );
}
