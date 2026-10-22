import { motion } from "motion/react";
import Wrapper from "../components/Wrapper";
import Eyebrow from "../components/Eyebrow";
import MaskedLines from "../components/MaskedLines";
import ThumbnailScroller from "../components/ThumbnailScroller";
import HeroPrompt from "./components/hero/HeroPrompt";
import HeroSpecs from "./components/hero/HeroSpecs";
import { sampleThumbnails } from "../data/hero";
import { enterTransition, fadeUp } from "../lib/motion";

// The second marquee row starts mid-list so the two rows never line up.
const secondRow = [...sampleThumbnails.slice(3), ...sampleThumbnails.slice(0, 3)];

// Above the fold, so everything enters on mount rather than on scroll.
const enter = (delay: number) => ({ variants: fadeUp, initial: "hidden", animate: "visible", custom: delay });

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-(--section-y)">
      <div aria-hidden="true" className="backdrop-grid pointer-events-none absolute inset-x-0 top-0 h-176" />
      <div aria-hidden="true" className="backdrop-grain pointer-events-none absolute inset-0" />

      <Wrapper className="relative pt-12 sm:pt-16 lg:pt-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <motion.div {...enter(0)}>
              <Eyebrow dot>YouTube thumbnail generator</Eyebrow>
            </motion.div>
            <h1 className="mt-6 text-[clamp(2.5rem,1.5rem+5vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-text-primary">
              <MaskedLines
                trigger="mount"
                lines={[
                  "Thumbnails that",
                  <>
                    earn the <span className="text-primary">click.</span>
                  </>,
                ]}
              />
            </h1>
          </div>
          <motion.p
            {...enter(0.15)}
            className="max-w-[38ch] text-pretty text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-[1.55] text-text-secondary lg:col-span-4"
          >
            Describe your video in a sentence. Pick a style, size and colors, add a reference
            image if you have one, and get a thumbnail in seconds.
          </motion.p>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          {/* min-w-0: grid items grow to their content by default, and the template chips row is long */}
          <motion.div {...enter(0.25)} className="min-w-0 lg:col-span-8">
            <HeroPrompt />
          </motion.div>
          <HeroSpecs delay={0.35} className="lg:col-span-4 lg:self-start" />
        </div>
      </Wrapper>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={enterTransition(0.4, 1)}
        className="relative mt-16 perspective-[1600px] lg:mt-24"
      >
        <div className="flex origin-top rotate-x-8 flex-col gap-3 md:gap-4">
          <ThumbnailScroller items={sampleThumbnails} duration={70} />
          <ThumbnailScroller items={secondRow} direction="right" duration={85} />
        </div>
      </motion.div>
    </section>
  );
}
