import Wrapper from "../../../components/Wrapper";
import Eyebrow from "../../../components/Eyebrow";
import Reveal from "../../../components/Reveal";
import PromptMock from "./PromptMock";
import FeedMock from "./FeedMock";
import { STAGGER } from "../../../lib/motion";
import {
  PROCESS_FEED,
  PROCESS_FEED_SLOT,
  PROCESS_PROMPT,
  PROCESS_SETTINGS,
  PROCESS_THUMBNAIL,
  steps,
} from "../../../data/steps";

// Each step's picture, in its finished state.
const STEP_VISUALS = [
  <PromptMock prompt={PROCESS_PROMPT} settings={PROCESS_SETTINGS} showSettings={false} />,
  <PromptMock prompt={PROCESS_PROMPT} settings={PROCESS_SETTINGS} />,
  <img
    src={PROCESS_THUMBNAIL}
    alt=""
    loading="lazy"
    decoding="async"
    className="aspect-video w-full rounded-xl border border-border object-cover"
  />,
  <FeedMock
    videos={PROCESS_FEED.slice(PROCESS_FEED_SLOT, PROCESS_FEED_SLOT + 2)}
    slot={0}
    className="grid-cols-2 gap-3 rounded-xl border border-border p-3"
  />,
];

// Phones, tablets and reduced motion: the walkthrough as four steps, no pinning or scrubbing.
export default function ProcessSteps() {
  return (
    <Wrapper className="mt-12">
      <ol className="grid gap-12 md:grid-cols-2 md:gap-x-6 md:gap-y-16">
        {steps.map(({ title, description }, index) => (
          <li key={title}>
            <Reveal delay={(index % 2) * STAGGER}>
              <div aria-hidden="true">{STEP_VISUALS[index]}</div>
              <Eyebrow className="mt-6">Step {String(index + 1).padStart(2, "0")}</Eyebrow>
              <h3 className="mt-2 text-lg font-medium tracking-[-0.015em] text-text-primary">{title}</h3>
              <p className="mt-1 max-w-[46ch] text-[0.9375rem] leading-relaxed text-text-secondary">{description}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Wrapper>
  );
}
