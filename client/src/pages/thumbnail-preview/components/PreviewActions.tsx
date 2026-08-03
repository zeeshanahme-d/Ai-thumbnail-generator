import { Download, Share2 } from "lucide-react";
import Button from "../../../components/Button";
import { handleDownloadFile } from "../../../lib/herlper-fuctions";
import type { Thumbnail } from "../../../types";
import { getThumbnailImageUrl } from "../../../lib/thumbnail";

interface PreviewActionsProps {
  thumbnail: Thumbnail;
}

export default function PreviewActions({ thumbnail }: PreviewActionsProps) {
  const imageUrl = getThumbnailImageUrl(thumbnail);

  const handleDownload = () => {
    handleDownloadFile(
      imageUrl,
      thumbnail.thumbnail?.originalName || thumbnail.title || "thumbnail"
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: thumbnail.title,
        text: `Check out this AI-generated thumbnail: ${thumbnail.title}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth={false}
        onClick={handleDownload}
        className="gap-2"
        aria-label="Download thumbnail"
      >
        <Download size={15} />
        Download
      </Button>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth={false}
        onClick={handleShare}
        className="gap-2"
        aria-label="Share thumbnail"
      >
        <Share2 size={15} />
        Share
      </Button>
    </div>
  );
}
