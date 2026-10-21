import { useEffect } from "react";
import { X, Download } from "lucide-react";
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

  if (!open || !thumbnail) return null;

  const imageUrl = getThumbnailImageUrl(thumbnail);
  const details = [
    { label: "Style", value: thumbnail.style },
    { label: "Size", value: thumbnail.aspect_ratio || "16:9" },
    { label: "Color", value: thumbnail.color_scheme },
    { label: "Text", value: thumbnail.text_overlay ? "On" : "Off" },
  ].filter((detail) => detail.value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop: dark in both themes, so the image reads as it will on a screen */}
      <div onClick={onClose} className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      <div className="relative z-10 flex max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-background-card shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-border bg-background-surface px-5 py-3">
          <h3 className="max-w-md truncate text-sm font-medium text-text-primary">{thumbnail.title}</h3>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              fullWidth={false}
              onClick={() => handleDownloadFile(imageUrl, thumbnail.title)}
            >
              <Download size={14} />
              Download
            </Button>
            <Button
              variant="secondary"
              size="iconSm"
              onClick={onClose}
              aria-label="Close fullscreen preview"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-black/40 p-4 sm:p-6">
          <img
            src={imageUrl}
            alt={thumbnail.title}
            loading="lazy"
            decoding="async"
            className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
          />
        </div>

        {/* Details */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border bg-background-surface px-5 py-3 text-xs">
          {details.map(({ label, value }) => (
            <span key={label} className="flex items-center gap-2">
              <span className="font-mono uppercase tracking-[0.06em] text-text-muted">{label}</span>
              <span className="text-text-primary">{value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
