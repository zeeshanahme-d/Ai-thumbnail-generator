import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Eyebrow from "../../../components/Eyebrow";
import { STYLE_DOTS } from "../../../data/community";
import { THUMBNAIL_STYLES } from "../../../data/generator";

interface PreviewStyleCardProps {
  style: string;
}

export default function PreviewStyleCard({ style }: PreviewStyleCardProps) {
  const dot = STYLE_DOTS[style];
  // The same description the generator's style picker shows.
  const description = THUMBNAIL_STYLES.find(({ label }) => label === style)?.description;

  return (
    <div className="rounded-2xl border border-border bg-background-card p-5 shadow-card">
      <Eyebrow>Style</Eyebrow>
      <p className="mt-3 flex items-center gap-2 text-sm font-medium text-text-primary">
        {dot && <span className={`size-2 rounded-full ${dot}`} />}
        {style}
      </p>
      {description && <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{description}</p>}
      <Link
        to={`/community?style=${encodeURIComponent(style)}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
      >
        Browse {style} thumbnails
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
