import Eyebrow from "../../../components/Eyebrow";
import type { PromptMockProps } from "../../../types";

// A picture of the prompt box for the walkthrough: the example prompt and its settings.
// Display only; the real, working prompt box is PromptCard in the hero.
// The data-process attributes are the hooks ProcessTimeline animates.
export default function PromptMock({ prompt, settings, showSettings = true, className = "" }: PromptMockProps) {
  return (
    <div data-process="composer" className={`rounded-xl border border-border bg-background p-4 sm:p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <Eyebrow>Prompt</Eyebrow>
        <Eyebrow>Example</Eyebrow>
      </div>

      {/* The full prompt sits invisibly underneath, so the box keeps its height while the text types in. */}
      <div className="mt-2 grid text-[0.9375rem] leading-relaxed">
        <p className="invisible col-start-1 row-start-1">{prompt}</p>
        <p className="col-start-1 row-start-1 text-text-primary">
          <span data-process="prompt-text">{prompt}</span>
          <span className="ml-0.5 inline-block h-[1.1em] w-px translate-y-[0.2em] animate-pulse bg-text-primary motion-reduce:animate-none" />
        </p>
      </div>

      {showSettings && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          {settings.map(({ label, value }) => (
            <span
              key={label}
              data-process="chip"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-card px-2.5 py-1 text-xs"
            >
              <span className="font-mono uppercase tracking-[0.06em] text-text-muted">{label}</span>
              <span className="text-text-primary">{value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
