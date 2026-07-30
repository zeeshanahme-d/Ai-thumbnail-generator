import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PreviewGenerateCTAProps {
  style?: string;
}

export default function PreviewGenerateCTA({ style }: PreviewGenerateCTAProps) {
  return (
    <div className="rounded-2xl bg-linear-to-br from-primary/90 to-primary/70 p-5 text-white">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/70">
        <Sparkles size={11} />
        Create with AI
      </p>
      <h3 className="mt-2 text-lg font-semibold leading-snug">
        Generate a Similar Thumbnail
      </h3>
      <p className="mt-1 text-xs text-white/75">
        {style
          ? `Inspired by this ${style} style? Create your own version in seconds — free, no sign-up needed.`
          : "Create your own AI thumbnail in seconds — free, no sign-up needed."}
      </p>
      <Link
        to="/dashboard/generate"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white py-2 text-sm font-semibold text-primary transition hover:bg-white/90"
      >
        <ArrowRight size={15} />
        Generate for Free
      </Link>
    </div>
  );
}
