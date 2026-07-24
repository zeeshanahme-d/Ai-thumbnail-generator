import { CheckIcon } from "lucide-react";
import PromptCard from "../components/image-generate-components/PromptCard";
import ThumbnailScroller from "../components/ThumbnailScroller";
import Wrapper from "../components/Wrapper";
import { motion } from "motion/react";

export default function HeroSection() {
  const specialFeatures = [
    "No design skills needed",
    "Fast generation",
    "High CTR templates",
  ];

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.18] bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-size-[48px_48px]"></div>
      <Wrapper className="relative flex flex-col items-center justify-center mt-28">
        <motion.h1
          className="text-[clamp(2rem,5vw,4rem)] text-center font-medium leading-[1.04] tracking-[-0.04em] mb-5"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
        >
          Create Thumbnails That <br />
          <span className="text-primary">Stop the Scroll.</span>
        </motion.h1>
        <motion.p
          className="text-base text-center text-text-secondary max-w-lg mt-5"
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

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-14 mt-6">
          {specialFeatures.map((feature, index) => (
            <motion.p
              className="flex items-center gap-2"
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.3 }}
            >
              <CheckIcon className="size-3 text-pink-600" />
              <span className="text-text-muted text-xs">{feature}</span>
            </motion.p>
          ))}
        </div>
        <motion.div
          className="w-full mt-8"
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
            className="mx-auto max-w-[720px]"
            onSubmit={() => {}}
          />
        </motion.div>
        <motion.div
          className="relative flex flex-col gap-4 my-16"
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
