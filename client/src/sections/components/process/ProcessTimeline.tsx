import { gsap, ScrollTrigger, useGSAP } from "../../../lib/gsap";
import { RICH_MOTION_QUERY } from "../../../lib/useMediaQuery";
import { PROCESS_PROMPT } from "../../../data/steps";
import type { ProcessTimelineProps } from "../../../types";

// Where each beat sits on the timeline (in timeline seconds; the scroll scrubs through all of it).
const AT = { type: 0, settings: 2.6, render: 4, feed: 7, end: 10 };

// The step each part of the timeline belongs to, as progress from 0 to 1.
const STEP_STARTS = [AT.type, AT.settings, AT.render, AT.feed].map((at) => at / AT.end);

const stepAt = (progress: number) => STEP_STARTS.filter((start) => progress >= start).length - 1;

// Position and size of `element` inside `ancestor`, from layout offsets, so a transform
// that is mid-animation (or a scale) never skews the measurement.
function boxWithin(element: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;

  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return { x, y, width: element.offsetWidth, height: element.offsetHeight };
}

// The homepage walkthrough, scrubbed by scroll: the prompt types itself, the setting chips snap on,
// the thumbnail sharpens out of a blur, then shrinks into its slot in the YouTube feed.
// Rendered by ProcessStory; only runs where RICH_MOTION_QUERY matches.
export default function ProcessTimeline({ scope }: ProcessTimelineProps) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(RICH_MOTION_QUERY, () => {
        const q = gsap.utils.selector(root);
        const stage = q<HTMLElement>('[data-process="stage"]')[0];
        const promptText = q<HTMLElement>('[data-process="prompt-text"]')[0];
        const result = q<HTMLElement>('[data-process="result"]')[0];
        const slot = q<HTMLElement>('[data-process="slot"]')[0];
        const stepItems = q<HTMLElement>('[data-process="step"]');
        if (!stage || !promptText || !result || !slot) return;

        const showStep = (progress: number) => {
          const current = stepAt(progress);
          stepItems.forEach((item, index) =>
            item.setAttribute("data-state", index < current ? "past" : index === current ? "current" : "upcoming"),
          );
        };

        // Centre-to-centre move and scale that land the thumbnail exactly on the slot's 16:9 thumbnail.
        const landing = () => {
          const from = boxWithin(result, stage);
          const to = boxWithin(slot, stage);
          const toHeight = (to.width * 9) / 16;
          return {
            x: to.x + to.width / 2 - (from.x + from.width / 2),
            y: to.y + toHeight / 2 - (from.y + from.height / 2),
            scale: to.width / from.width,
          };
        };

        const chips = q('[data-process="chip"]');
        const typing = { chars: 0 };
        promptText.textContent = "";
        showStep(0);
        // Set up front: a staggered fromTo only applies its start state to the first target right away.
        gsap.set(chips, { opacity: 0, y: 8, scale: 0.96 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top 64px", // the sticky stage sits under the 64px navbar
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => showStep(self.progress),
            onRefresh: (self) => showStep(self.progress),
          },
        });

        timeline
          .to(
            typing,
            {
              chars: PROCESS_PROMPT.length,
              duration: AT.settings - AT.type - 0.2,
              onUpdate: () => {
                promptText.textContent = PROCESS_PROMPT.slice(0, Math.round(typing.chars));
              },
            },
            AT.type,
          )
          .to(chips, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.3, ease: "power3.out" }, AT.settings)
          .fromTo(
            result,
            { opacity: 0, scale: 1.04, filter: "blur(24px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2.4, ease: "power2.out" },
            AT.render,
          )
          .to(q('[data-process="composer"]'), { opacity: 0, y: -16, duration: 1, ease: "power2.inOut" }, AT.feed)
          .fromTo(q('[data-process="feed"]'), { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power2.out" }, AT.feed + 0.6)
          .to(
            result,
            {
              x: () => landing().x,
              y: () => landing().y,
              scale: () => landing().scale,
              duration: 2.2,
              ease: "power3.inOut",
            },
            AT.feed,
          )
          // Hand over to the feed's own card, so its duration badge shows.
          .to(result, { opacity: 0, duration: 0.4 }, AT.feed + 2.3)
          .fromTo(q('[data-process="rail-fill"]'), { scaleY: 0 }, { scaleY: 1, duration: AT.end }, 0);

        // Text reflows once the web font arrives; measure again then.
        document.fonts.ready.then(() => ScrollTrigger.refresh());

        return () => {
          promptText.textContent = PROCESS_PROMPT;
          stepItems.forEach((item) => item.removeAttribute("data-state"));
        };
      });
    },
    { scope },
  );

  return null;
}
