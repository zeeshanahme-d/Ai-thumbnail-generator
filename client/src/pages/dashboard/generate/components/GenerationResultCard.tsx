import { useState } from "react";
import { motion } from "motion/react";
import {
  Download,
  Maximize2,
  RefreshCw,
  Sparkles,
  Globe,
  GlobeLock,
  Loader2,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../../components/Button";
import GenerationPreviewModal from "./GenerationPreviewModal";
import { handleDownloadFile } from "../../../../lib/herlper-fuctions";
import { getThumbnailImageUrl } from "../../../../lib/thumbnail";
import usePublishThumbnail from "../../../dashboard/core/hooks/usePublishThumbnail";
import type { Thumbnail } from "../../../../types";

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-primary/40 bg-background-card p-5 shadow-2xl sm:p-6"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase text-text-on-primary">
              <Sparkles size={13} />
              Generated Successfully
            </span>
            <span className="text-xs text-text-secondary">
              {thumbnail.style} &bull; {thumbnail.aspect_ratio || "16:9"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              fullWidth={false}
              onClick={onNewPrompt}
              className="gap-1.5 text-xs"
            >
              <Plus size={14} />
              New Prompt
            </Button>
          </div>
        </div>

        {/* Thumbnail Preview Area */}
        <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-xl border border-border bg-background-surface-2 group">
          <img
            src={imageUrl}
            alt={thumbnail.title}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />

          {/* Quick Overlay Action on Image */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-xs">
            <Button
              variant="secondary"
              size="sm"
              fullWidth={false}
              onClick={() => setFullscreenOpen(true)}
              className="gap-2 bg-white/90 text-black hover:bg-white"
            >
              <Maximize2 size={16} />
              Fullscreen Preview
            </Button>
          </div>
        </div>

        {/* Title and prompt info */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-text-primary">
            {thumbnail.title}
          </h3>
          {thumbnail.user_prompt && (
            <p className="mt-1 text-xs text-text-secondary italic">
              "{thumbnail.user_prompt}"
            </p>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            {/* Download Button */}
            <Button
              variant="primary"
              size="sm"
              fullWidth={false}
              onClick={() =>
                handleDownloadFile(
                  imageUrl,
                  thumbnail.thumbnail?.originalName || "thumbnail.png"
                )
              }
              className="gap-2"
            >
              <Download size={15} />
              Download High-Res
            </Button>

            {/* Regenerate Button */}
            <Button
              variant="secondary"
              size="sm"
              fullWidth={false}
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="gap-2"
            >
              {isRegenerating ? (
                <Loader2 size={15} className="animate-spin text-primary" />
              ) : (
                <RefreshCw size={15} />
              )}
              Regenerate
            </Button>

            {/* Fullscreen Button */}
            <Button
              variant="secondary"
              size="sm"
              fullWidth={false}
              onClick={() => setFullscreenOpen(true)}
              className="gap-2"
            >
              <Maximize2 size={15} />
              Fullscreen
            </Button>
          </div>

          {/* Publish / Community Share */}
          <div>
            <Button
              variant="outline"
              size="sm"
              fullWidth={false}
              onClick={handleTogglePublish}
              disabled={isPublishing}
              className={`gap-2 ${
                thumbnail.published ? "text-success border-success/30" : ""
              }`}
            >
              {isPublishing ? (
                <Loader2 size={15} className="animate-spin text-primary" />
              ) : thumbnail.published ? (
                <GlobeLock size={15} className="text-success" />
              ) : (
                <Globe size={15} />
              )}
              {thumbnail.published ? "Published" : "Publish to Community"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <GenerationPreviewModal
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        thumbnail={thumbnail}
      />
    </>
  );
}
