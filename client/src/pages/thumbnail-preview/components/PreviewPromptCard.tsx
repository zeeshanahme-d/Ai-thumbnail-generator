import { Sparkles, ArrowRight } from "lucide-react";
import type { Thumbnail } from "../../../types";

interface PreviewPromptCardProps {
  thumbnail: Thumbnail;
}

export default function PreviewPromptCard({ thumbnail }: PreviewPromptCardProps) {
  const prompt = thumbnail.user_prompt || thumbnail.prompt_used || "";

  if (!prompt) return null;

  return (
    <div className="rounded-2xl border border-border bg-background-surface-2 p-5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary">
        <Sparkles size={11} />
        AI Prompt Used
      </p>

      <p className="mt-3 text-sm italic text-text-secondary leading-relaxed">
        "{prompt}"
      </p>

      <button
        type="button"
        className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
        onClick={() => {
          const el = document.createElement("textarea");
          el.value = prompt;
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
        }}
      >
        Use this prompt
        <ArrowRight size={12} />
      </button>
    </div>
  );
}
