import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { STYLE_DOTS } from "../../../data/community";

interface PreviewStyleCardProps {
  style: string;
}

export default function PreviewStyleCard({ style }: PreviewStyleCardProps) {
  const dot = STYLE_DOTS[style];

  const STYLE_DESCRIPTIONS: Record<string, string> = {
    "Bold & Graphic": "Energetic composition, striking vibrant colors",
    Minimalist: "Clean layout, restrained palette, strong whitespace",
    Photorealistic: "Cinematic quality, real-world textures and lighting",
    Illustrated: "Hand-crafted artwork, expressive characters",
    "Tech/Futuristic": "Neon glows, dark gradients, sci-fi aesthetics",
  };

  const description = STYLE_DESCRIPTIONS[style] ?? "A unique AI-generated style";

  return (
    <div className="rounded-2xl border border-border bg-background-card p-5">
      <div className="flex items-center gap-2">
        {dot && <span className={`size-2.5 rounded-full ${dot}`} />}
        <p className="text-sm font-semibold text-text-primary">{style} Style</p>
      </div>
      <p className="mt-1 text-xs text-text-muted">{description}</p>
      <Link
        to={`/community?style=${encodeURIComponent(style)}`}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        Browse {style} thumbnails
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}
