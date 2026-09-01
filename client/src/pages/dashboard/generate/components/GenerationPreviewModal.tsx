import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Maximize2 } from "lucide-react";
import Button from "../../../../components/Button";
import { handleDownloadFile } from "../../../../lib/herlper-fuctions";
import type { Thumbnail } from "../../../../types";
import { getThumbnailImageUrl } from "../../../../lib/thumbnail";

interface GenerationPreviewModalProps {
  open: boolean;
  onClose: () => void;
  thumbnail: Thumbnail | null;
}

export default function GenerationPreviewModal({
  open,
  onClose,
  thumbnail,
}: GenerationPreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!thumbnail) return null;

  const imageUrl = getThumbnailImageUrl(thumbnail);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 flex max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-background-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-background-surface px-5 py-3">
              <div className="flex items-center gap-2">
                <Maximize2 size={16} className="text-primary" />
                <h3 className="truncate text-sm font-semibold text-text-primary max-w-md">
                  {thumbnail.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth={false}
                  onClick={() =>
                    handleDownloadFile(
                      imageUrl,
                      thumbnail.thumbnail?.originalName || "thumbnail.png"
                    )
                  }
                  className="gap-1.5 text-xs"
                >
                  <Download size={14} />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={onClose}
                  className="text-text-muted hover:text-text-primary"
                  aria-label="Close fullscreen preview"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Image display */}
            <div className="flex flex-1 items-center justify-center overflow-auto p-4 sm:p-6 bg-black/40">
              <img
                src={imageUrl}
                alt={thumbnail.title}
                loading="lazy"
                decoding="async"
                className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>

            {/* Footer details */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background-surface px-5 py-3 text-xs text-text-secondary">
              <div className="flex items-center gap-4">
                <span>
                  Style: <strong className="text-text-primary">{thumbnail.style}</strong>
                </span>
                <span>
                  Aspect: <strong className="text-text-primary">{thumbnail.aspect_ratio || "16:9"}</strong>
                </span>
                <span>
                  Color: <strong className="text-text-primary">{thumbnail.color_scheme || "Vibrant"}</strong>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
