import { lazy, Suspense, useRef } from "react";
import Wrapper from "../../../components/Wrapper";
import Eyebrow from "../../../components/Eyebrow";
import PromptMock from "./PromptMock";
import FeedMock from "./FeedMock";
import {
  PROCESS_FEED,
  PROCESS_FEED_SLOT,
  PROCESS_PROMPT,
  PROCESS_SETTINGS,
  PROCESS_THUMBNAIL,
  steps,
} from "../../../data/steps";

// GSAP arrives in its own chunk; until then (or if it never does) the stage shows the finished prompt and thumbnail.
const ProcessTimeline = lazy(() => import("./ProcessTimeline"));

// Wide screens with motion allowed: a tall section whose stage sticks under the navbar while
// ProcessTimeline scrubs the walkthrough against the scroll. CSS sticky does the pinning, so the
// page height is fixed from the first paint and anchors below never move.
export default function ProcessStory() {
  const scope = useRef<HTMLDivElement>(null);

  return (
    <div ref={scope} className="relative mt-16 h-[400vh]">
      <div className="sticky top-16 flex h-[calc(100dvh-4rem)] items-center">
        <Wrapper className="grid grid-cols-12 items-center gap-8">
          <StepRail />
          <Stage />
        </Wrapper>
      </div>

      <Suspense fallback={null}>
        <ProcessTimeline scope={scope} />
      </Suspense>
    </div>
  );
}

// The steps down the left, with a line that fills as the walkthrough plays.
// The timeline sets data-state on each step; without it every step shows at full strength.
function StepRail() {
  return (
    <ol className="relative col-span-4">
      <span aria-hidden="true" className="absolute bottom-2 left-1.75 top-2 w-px bg-border" />
      <span aria-hidden="true" data-process="rail-fill" className="absolute bottom-2 left-1.75 top-2 w-px origin-top bg-primary" />
      {steps.map(({ title, description }, index) => (
        <li
          key={title}
          data-process="step"
          className="group relative pb-9 pl-9 transition-opacity duration-300 last:pb-0 data-[state=upcoming]:opacity-40"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-0.5 size-3.75 rounded-full border border-border-strong bg-background transition-colors duration-300 group-data-[state=current]:border-primary group-data-[state=current]:bg-primary group-data-[state=past]:border-primary"
          />
          <Eyebrow>Step {String(index + 1).padStart(2, "0")}</Eyebrow>
          <h3 className="mt-2 text-lg font-medium tracking-[-0.015em] text-text-primary">{title}</h3>
          <p className="mt-1 max-w-[34ch] text-sm leading-relaxed text-text-secondary">{description}</p>
        </li>
      ))}
    </ol>
  );
}

// The picture on the right: the prompt box and the generated thumbnail, with the YouTube feed underneath.
// Decorative: the step list carries the content for screen readers.
function Stage() {
  return (
    <div
      aria-hidden="true"
      data-process="stage"
      className="relative col-span-8 h-[min(38rem,calc(100dvh-9rem))] overflow-hidden rounded-2xl border border-border bg-background-card shadow-card"
    >
      <div data-process="feed" className="absolute inset-0 opacity-0">
        <FeedMock videos={PROCESS_FEED} slot={PROCESS_FEED_SLOT} className="h-full grid-cols-3 gap-x-4 gap-y-6 p-6" />
      </div>

      <div className="absolute inset-0 flex flex-col gap-5 p-6">
        <PromptMock prompt={PROCESS_PROMPT} settings={PROCESS_SETTINGS} />
        {/* A size container, so the 16:9 frame takes whichever of width or height runs out first. */}
        <div className="relative grid flex-1 place-items-center @container-size">
          <img
            data-process="result"
            src={PROCESS_THUMBNAIL}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ width: "min(100cqw, 177.78cqh)" }}
            className="aspect-video rounded-xl border border-border object-cover"
          />
        </div>
      </div>
    </div>
  );
}
