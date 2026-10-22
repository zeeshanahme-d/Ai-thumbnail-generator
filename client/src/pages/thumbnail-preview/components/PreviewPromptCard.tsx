import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import { savePendingPrompt } from "../../../lib/pendingPrompt";
import type { Thumbnail } from "../../../types";

interface PreviewPromptCardProps {
  thumbnail: Thumbnail;
}

export default function PreviewPromptCard({ thumbnail }: PreviewPromptCardProps) {
  const navigate = useNavigate();
  const prompt = thumbnail.user_prompt || thumbnail.prompt_used || "";

  if (!prompt) return null;

  // Opens the generator with this prompt filled in (signed-out visitors sign in first).
  const handleUsePrompt = () => {
    savePendingPrompt(prompt);
    navigate("/dashboard/generate");
  };

  return (
    <div className="rounded-2xl border border-border bg-background-card p-5 shadow-card sm:p-6">
      <Eyebrow>Prompt</Eyebrow>
      <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-text-primary wrap-break-word">{prompt}</p>
      <Button type="button" variant="secondary" size="sm" rounded="lg" fullWidth={false} onClick={handleUsePrompt} className="mt-5">
        Use this prompt
        <ArrowRight size={14} />
      </Button>
    </div>
  );
}
