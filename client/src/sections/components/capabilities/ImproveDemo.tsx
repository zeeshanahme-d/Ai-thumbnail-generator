import { WandSparkles } from "lucide-react";
import Eyebrow from "../../../components/Eyebrow";
import { IMPROVE_EXAMPLE } from "../../../data/capabilities";
import { useTypewriter } from "../../../lib/useTypewriter";
import type { CapabilityDemoProps } from "../../../types";

const IMPROVED = [IMPROVE_EXAMPLE.improved];

// A rough idea, the Improve control, and the fuller prompt typing itself out (marked as an example).
export default function ImproveDemo({ active }: CapabilityDemoProps) {
  const typed = useTypewriter(IMPROVED, { paused: !active, typeMs: 24, holdMs: 3200 });

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="rounded-lg border border-border bg-background-card p-3.5">
        <Eyebrow>Your idea</Eyebrow>
        <p className="mt-1.5 text-sm text-text-primary">{IMPROVE_EXAMPLE.idea}</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background-card px-2 py-1 font-medium text-text-secondary">
          <WandSparkles size={13} aria-hidden="true" />
          Improve
        </span>
        <span>No credits used</span>
      </div>

      <div className="flex-1 rounded-lg border border-border bg-background-card p-3.5">
        <div className="flex items-center justify-between">
          <Eyebrow>Improved prompt</Eyebrow>
          <Eyebrow>Example</Eyebrow>
        </div>
        {/* The full text sits invisibly underneath, so the box has its final height from the start. */}
        <div className="mt-1.5 grid text-sm leading-relaxed">
          <p aria-hidden="true" className="invisible col-start-1 row-start-1">
            {IMPROVE_EXAMPLE.improved}
          </p>
          <p className="col-start-1 row-start-1 text-text-primary">
            <span className="sr-only">{IMPROVE_EXAMPLE.improved}</span>
            <span aria-hidden="true">
              {typed}
              <span className="ml-0.5 inline-block h-[1.1em] w-px translate-y-[0.2em] animate-pulse bg-text-primary motion-reduce:animate-none" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
