import { useState } from "react";
import {
  Download,
  Maximize2,
  RefreshCw,
  Globe,
  GlobeLock,
  Loader2,
  MonitorPlay,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../../../components/Button";
import Eyebrow from "../../../../components/Eyebrow";
import GenerationPreviewModal from "./GenerationPreviewModal";
import { handleDownloadFile } from "../../../../lib/helpers";
import { getThumbnailFormatLabel, getThumbnailImageUrl, hasYouTubePreview } from "../../../../lib/thumbnail";
import usePublishThumbnail from "../../../../core/thumbnails/hooks/usePublishThumbnail";
import type { Thumbnail, YtPreviewState } from "../../../../types";

interface GenerationResultCardProps {
  thumbnail: Thumbnail;
  onRegenerate: () => void;
  onNewPrompt: () => void;
  isRegenerating?: boolean;
}

export default function GenerationResultCard({
  thumbnail,
  onRegenerate,
  onNewPrompt,
  isRegenerating = false,
}: GenerationResultCardProps) {
  const navigate = useNavigate();
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const imageUrl = getThumbnailImageUrl(thumbnail);
  const { mutate: publishMutate, isPending: isPublishing } = usePublishThumbnail();

  const handleTogglePublish = () => {
    const newPublished = !thumbnail.published;
    publishMutate(
      { id: thumbnail._id, published: newPublished },
      {
        onSuccess: () => {
          toast.success(
            newPublished
              ? "Thumbnail published to community gallery!"
              : "Thumbnail unpublished from community."
          );
        },
        onError: () => {
          toast.error("Failed to update publish status.");
        },
      }
    );
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-background-card p-5 shadow-card sm:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Eyebrow dot>Ready</Eyebrow>
            <span className="font-mono text-xs text-text-muted">
              {thumbnail.style} · {getThumbnailFormatLabel(thumbnail)}
            </span>
          </div>

          <Button variant="secondary" size="sm" fullWidth={false} onClick={onNewPrompt}>
            <Plus size={14} />
            New prompt
          </Button>
        </div>

        {/* Thumbnail preview */}
        <div className="group relative mt-5 aspect-video w-full overflow-hidden rounded-xl border border-border bg-background-surface-2">
          <img
            src={imageUrl}
            alt={thumbnail.title}
            loading="lazy"
            decoding="async"
            className="size-full object-contain"
          />

          {/* Quick action over the image */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
            <Button variant="inverse" size="sm" fullWidth={false} onClick={() => setFullscreenOpen(true)}>
              <Maximize2 size={16} />
              Fullscreen preview
            </Button>
          </div>
        </div>

        {/* Title and prompt */}
        <div className="mt-4">
          <h3 className="text-lg font-medium tracking-[-0.015em] text-text-primary">{thumbnail.title}</h3>
          {thumbnail.user_prompt && (
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{thumbnail.user_prompt}</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              fullWidth={false}
              onClick={() => handleDownloadFile(imageUrl, thumbnail.title)}
            >
              <Download size={15} />
              Download
            </Button>

            <Button
              variant="secondary"
              size="sm"
              fullWidth={false}
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
              Regenerate
            </Button>

            <Button variant="secondary" size="sm" fullWidth={false} onClick={() => setFullscreenOpen(true)}>
              <Maximize2 size={15} />
              Fullscreen
            </Button>

            {hasYouTubePreview(thumbnail) && (
              <Button
                variant="secondary"
                size="sm"
                fullWidth={false}
                onClick={() => navigate("/youtube-style-preview", { state: { thumbnail } satisfies YtPreviewState })}
              >
                <MonitorPlay size={15} />
                YouTube preview
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            fullWidth={false}
            onClick={handleTogglePublish}
            disabled={isPublishing}
            className={thumbnail.published ? "border-success/30! text-success!" : ""}
          >
            {isPublishing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : thumbnail.published ? (
              <GlobeLock size={15} className="text-success" />
            ) : (
              <Globe size={15} />
            )}
            {thumbnail.published ? "Published" : "Publish to community"}
          </Button>
        </div>
      </div>

      <GenerationPreviewModal
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        thumbnail={thumbnail}
      />
    </>
  );
}
