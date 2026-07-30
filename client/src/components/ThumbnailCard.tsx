import {
  Clock,
  Download,
  Eye,
  Globe,
  GlobeLock,
  Heart,
  Loader2,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { STYLE_DOTS } from "../data/community";
import { getThumbnailAuthorName, getThumbnailImageUrl } from "../lib/thumbnail";
import type { ThumbnailCardProps } from "../types";
import type { PreviewSource } from "../pages/thumbnail-preview/_types";
import Button from "./Button";
import useLikeThumbnail from "../pages/dashboard/core/hooks/useLikeThumbnail";
import usePublishThumbnail from "../pages/dashboard/core/hooks/usePublishThumbnail";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { handleDownloadFile } from "../helpers/herlper-fuctions";
import { useSession } from "../store/useSessionStore";

dayjs.extend(relativeTime);

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-blue-500",
];

const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

function getTimeAgo(date: string) {
  if (!date) return "";
  return dayjs(date).fromNow();
}

export default function ThumbnailCard({
  thumbnail,
  index,
  showDelete = false,
  showPublish = false,
  showLike = false,
  onDelete,
  showRecycleBinActions = false,
  onRestore,
  onPermanentDelete,
  restoring = false,
  source = "community",
}: ThumbnailCardProps & { source?: PreviewSource }) {
  const {
    title,
    style,
    isGenerating,
    likesCount,
    viewsCount,
    published,
    isLiked,
  } = thumbnail;
  const imageUrl = getThumbnailImageUrl(thumbnail);
  const authorName = getThumbnailAuthorName(thumbnail);
  const dot = (style && STYLE_DOTS[style]) || "bg-gray-400";

  const isAuthenticated = useSession((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const { mutate: likeMutate } = useLikeThumbnail();
  const { mutate: publishMutate, isPending: isPublishing } =
    usePublishThumbnail();

  const handleCardClick = () => {
    if (showRecycleBinActions || thumbnail.isGenerating) return;
    navigate(`/thumbnail/${thumbnail._id}`, {
      state: { thumbnail, source },
    });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDownloadFile(imageUrl, thumbnail.thumbnail?.originalName || "");
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to like thumbnails.");
      return;
    }

    likeMutate(thumbnail._id);
  };

  const handleTogglePublish = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPublished = !published;
    publishMutate(
      { id: thumbnail._id, published: newPublished },
      {
        onSuccess: () => {
          toast.success(
            newPublished
              ? "Thumbnail published to community!"
              : "Thumbnail unpublished.",
          );
        },
        onError: () => {
          toast.error("Failed to update publish status.");
        },
      },
    );
  };

  return (
    <motion.div
      className={`group overflow-hidden rounded-2xl border border-border bg-background-card transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.18)] ${
        !showRecycleBinActions && !thumbnail.isGenerating ? "cursor-pointer" : ""
      }`}
      onClick={handleCardClick}
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
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <span className={`size-2 rounded-full ${dot}`} />
            {style}
          </span>
        )}

        {showRecycleBinActions && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            Deleted
          </span>
        )}

        {!isGenerating && imageUrl && !showRecycleBinActions && (
          <div className="absolute right-3 top-3 flex gap-1">
            {/* Download button */}
            <Button
              type="button"
              size="iconSm"
              variant="secondary"
              onClick={handleDownload}
              className="bg-black/60 backdrop-blur border-none text-white hover:text-primary"
              aria-label="Download thumbnail"
            >
              <Download size={15} />
            </Button>

            {/* Publish / Unpublish button */}
            {showPublish && (
              <Button
                type="button"
                size="iconSm"
                variant="secondary"
                onClick={handleTogglePublish}
                disabled={isPublishing}
                className={`bg-black/60 backdrop-blur border-none text-white ${
                  published
                    ? "text-success hover:text-success/80"
                    : "hover:text-primary"
                }`}
                aria-label={
                  published ? "Unpublish thumbnail" : "Publish thumbnail"
                }
              >
                {isPublishing ? (
                  <Loader2 size={15} className="animate-spin text-primary" />
                ) : published ? (
                  <GlobeLock size={15} className="text-success" />
                ) : (
                  <Globe size={15} />
                )}
              </Button>
            )}

            {/* Delete button (if allowed) */}
            {showDelete && (
              <Button
                type="button"
                size="iconSm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(thumbnail._id);
                }}
                className="bg-black/60 backdrop-blur border-none text-white hover:text-red-400"
                aria-label="Delete thumbnail"
              >
                <Trash2 size={15} />
              </Button>
            )}

            {/* Like button */}
            {showLike && (
              <Button
                type="button"
                size="iconSm"
                variant="secondary"
                onClick={handleToggleLike}
                className="bg-black/60 backdrop-blur border-none text-white"
                aria-label="Like thumbnail"
              >
                <Heart
                  size={15}
                  className={isLiked ? "fill-primary text-primary" : ""}
                />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-text-primary">
          {title}
        </h3>

        <div className="flex justify-between items-center">
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

          {!showRecycleBinActions && (
            <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Heart
                  size={13}
                  className={isLiked ? "fill-primary text-primary" : ""}
                />
                {likesCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={13} />
                {viewsCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {getTimeAgo(thumbnail.createdAt)}
              </span>
            </div>
          )}
        </div>

        {showRecycleBinActions && (
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              rounded="lg"
              size="sm"
              onClick={() => onRestore?.(thumbnail._id)}
              disabled={restoring}
            >
              {restoring ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RotateCcw size={14} />
              )}
              Restore
            </Button>
            <Button
              type="button"
              variant="secondary"
              rounded="lg"
              size="sm"
              onClick={() => onPermanentDelete?.(thumbnail._id)}
              className="text-red-500 hover:text-red-400 hover:border-red-500/30"
            >
              <Trash2 size={14} />
              Delete Forever
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
