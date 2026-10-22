import { Download, MonitorPlay, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../../components/Button";
import { handleDownloadFile } from "../../../lib/herlper-fuctions";
import type { Thumbnail, YtPreviewState } from "../../../types";
import { getThumbnailImageUrl } from "../../../lib/thumbnail";
import { getThumbnailShareUrl } from "../../../core/thumbnails/_requests";

interface PreviewActionsProps {
  thumbnail: Thumbnail;
}

export default function PreviewActions({ thumbnail }: PreviewActionsProps) {
  const navigate = useNavigate();
  const imageUrl = getThumbnailImageUrl(thumbnail);

  const handleDownload = () => {
    handleDownloadFile(imageUrl, thumbnail.title);
  };

  const handleShare = async () => {
    const shareUrl = getThumbnailShareUrl(thumbnail._id);
    try {
      if (navigator.share) {
        await navigator.share({
          title: thumbnail.title,
          text: `Check out this AI-generated thumbnail: ${thumbnail.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard.");
      }
    } catch (error) {
      // Closing the share sheet rejects with AbortError, which is not a failure.
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Couldn't share this thumbnail.");
    }
  };

  return (
    // One swipeable row on phones, bleeding to the screen edges; sits in place from sm up.
    <div className="-mx-4 flex items-center gap-3 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0 [&>button]:shrink-0 [&>button]:whitespace-nowrap">
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

      <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth={false}
        onClick={() => navigate("/youtube-style-preview", { state: { thumbnail } satisfies YtPreviewState })}
        className="gap-2"
      >
        <MonitorPlay size={15} />
        YouTube preview
      </Button>
    </div>
  );
}
