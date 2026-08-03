import { Eye, Heart, Calendar } from "lucide-react";
import dayjs from "dayjs";
import type { Thumbnail } from "../../../types";

interface PreviewStatsProps {
  thumbnail: Thumbnail;
  isLiked?: boolean;
}

export default function PreviewStats({ thumbnail, isLiked }: PreviewStatsProps) {
  const { likesCount = 0, viewsCount = 0, publishedAt, createdAt } = thumbnail;
  const displayDate = publishedAt ?? createdAt;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
      <span className="flex items-center gap-1.5">
        <Heart
          size={16}
          className={isLiked ? "fill-primary text-primary" : "text-text-muted"}
        />
        <span className="font-medium text-text-primary">{likesCount}</span>
        <span>likes</span>
      </span>

      <span className="flex items-center gap-1.5">
        <Eye size={16} className="text-text-muted" />
        <span className="font-medium text-text-primary">{viewsCount}</span>
        <span>views</span>
      </span>

      <span className="flex items-center gap-1.5">
        <Calendar size={16} className="text-text-muted" />
        <span>{dayjs(displayDate).format("MMMM D, YYYY")}</span>
      </span>
    </div>
  );
}
