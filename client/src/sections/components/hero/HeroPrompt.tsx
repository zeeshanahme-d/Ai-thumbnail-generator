import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { useNavigate } from "react-router-dom";
import PromptCard from "../../../components/image-generate-components/PromptCard";
import { PROMPT_TEMPLATES } from "../../../data/generator";
import { savePendingPrompt } from "../../../lib/pendingPrompt";
import { useTypewriter } from "../../../lib/useTypewriter";
import type { PromptSubmission } from "../../../types";

const EXAMPLE_PROMPTS = PROMPT_TEMPLATES.map(({ prompt }) => prompt);

// The hero's prompt box. While nobody has touched it, the placeholder types out example prompts.
export default function HeroPrompt() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hasFocused, setHasFocused] = useState(false);
  const placeholder = useTypewriter(EXAMPLE_PROMPTS, { paused: !inView, stopped: hasFocused });

  // Signed-out visitors pass through login first; the prompt waits in the generator.
  const handleGenerate = ({ prompt }: PromptSubmission) => {
    savePendingPrompt(prompt);
    navigate("/dashboard/generate");
  };

  return (
    <div ref={ref} onFocus={() => setHasFocused(true)}>
      <PromptCard
        id="hero-prompt"
        ariaLabel="Describe your thumbnail"
        placeholder={placeholder}
        showTools={false}
        submitLabel="Generate free"
        onSubmit={handleGenerate}
      />
    </div>
  );
}
