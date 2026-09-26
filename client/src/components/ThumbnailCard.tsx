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
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { STYLE_DOTS } from "../data/community";
import {
  getThumbnailAuthorName,
  getThumbnailCardImageUrl,
  getThumbnailImageUrl,
  getShortTimeAgo,
} from "../lib/thumbnail";
import type { ThumbnailCardProps } from "../types";
import Button from "./Button";
import useLikeThumbnail from "../core/thumbnails/hooks/useLikeThumbnail";
import usePublishThumbnail from "../core/thumbnails/hooks/usePublishThumbnail";
import { handleDownloadFile } from "../lib/herlper-fuctions";
import { useSession } from "../store/useSessionStore";

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
  showDelete = false,
  showPublish = false,
  showLike = false,
  onDelete,
  showRecycleBinActions = false,
  onRestore,
  onPermanentDelete,
  restoring = false,
  source = "community",
}: ThumbnailCardProps) {
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
  const isLinked = !showRecycleBinActions && !isGenerating;

  const { mutate: likeMutate } = useLikeThumbnail();
  const { mutate: publishMutate, isPending: isPublishing } =
    usePublishThumbnail();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDownloadFile(imageUrl, thumbnail.title);
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
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-background-card transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.18)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary"
    >
      <div className="relative aspect-video overflow-hidden bg-background-surface-2">
        {isGenerating || !imageUrl ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-text-muted">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-xs font-medium">Generating...</span>
          </div>
        ) : (
          <img
            src={getThumbnailCardImageUrl(thumbnail)}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {style && !isGenerating && (
          <span className="absolute left-3 top-3 flex max-w-[calc(100%-9.5rem)] items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <span className={`size-2 shrink-0 rounded-full ${dot}`} />
            <span className="truncate">{style}</span>
          </span>
        )}

        {showRecycleBinActions && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            Deleted
          </span>
        )}

        {!isGenerating && imageUrl && !showRecycleBinActions && (
          <div className="absolute right-3 top-3 z-10 flex gap-1">
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
                className={`bg-black/60 backdrop-blur border-none text-white ${published
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
        <h3 className="line-clamp-2 min-h-10 text-sm/5 font-medium text-text-primary">
          {/* The link's ::after covers the whole card, so the card is one keyboard-reachable
              link; the action buttons sit above it with z-10. */}
          {isLinked ? (
            <Link
              to={`/thumbnail/${thumbnail._id}`}
              state={{ thumbnail, source }}
              className="outline-none after:absolute after:inset-0"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
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
            <div className="flex shrink-0 items-center gap-2.5 text-xs text-text-muted">
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
                {getShortTimeAgo(thumbnail.createdAt)}
              </span>
            </div>
          )}
        </div>

        {showRecycleBinActions && (
          <div className="mt-4 grid grid-cols-2 gap-2">
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
    </div>
  );
}
