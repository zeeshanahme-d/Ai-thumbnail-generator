import { CheckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PromptCard from "../components/image-generate-components/PromptCard";
import ThumbnailScroller from "../components/ThumbnailScroller";
import Wrapper from "../components/Wrapper";
import { motion } from "motion/react";
import { savePendingPrompt } from "../lib/pendingPrompt";
import type { PromptSubmission } from "../types";

export default function HeroSection() {
  const navigate = useNavigate();

  // Signed-out visitors pass through login first; the prompt waits in the generator.
  const handleGenerate = ({ prompt }: PromptSubmission) => {
    savePendingPrompt(prompt);
    navigate("/dashboard/generate");
  };

  const specialFeatures = [
    "No design skills needed",
    "Fast generation",
    "High CTR templates",
  ];

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.18] bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-size-[48px_48px]"></div>
      <Wrapper className="relative flex flex-col items-center justify-center pt-14 sm:pt-20 lg:pt-24">
        <motion.h1
          className="max-w-4xl text-balance text-[clamp(2.25rem,1.4rem+3.6vw,4rem)] text-center font-medium leading-[1.05] tracking-[-0.04em]"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
        >
          Create Thumbnails That <br className="hidden sm:block" />
          <span className="text-primary">Stop the Scroll.</span>
        </motion.h1>
        <motion.p
          className="mt-5 max-w-lg text-pretty text-center text-sm leading-relaxed text-text-secondary sm:text-base"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 320,
            damping: 70,
            mass: 1,
          }}
        >
          Describe your idea and let our AI generate a stunning, click-worthy
          thumbnail in seconds.
        </motion.p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-10">
          {specialFeatures.map((feature, index) => (
            <motion.p
              className="flex items-center gap-2"
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.3 }}
            >
              <CheckIcon className="size-3.5 text-primary" />
              <span className="text-xs text-text-secondary sm:text-sm">{feature}</span>
            </motion.p>
          ))}
        </div>
        <motion.div
          className="mt-8 w-full md:mt-10"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 320,
            damping: 70,
            mass: 1,
          }}
        >
          <PromptCard
            id="hero-prompt"
            showTools={false}
            submitLabel="Generate Free"
            className="mx-auto max-w-3xl"
            onSubmit={handleGenerate}
          />
        </motion.div>
        <motion.div
          className="relative mt-12 mb-14 flex w-full flex-col gap-3 md:mt-16 md:mb-20 md:gap-4"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          <ThumbnailScroller direction="left" className="max-w-6xl mx-auto" />
          <ThumbnailScroller direction="right" className="max-w-6xl mx-auto" />
        </motion.div>
      </Wrapper>
    </section>
  );
}
