import { motion } from "motion/react";
import Wrapper from "../components/Wrapper";
import { steps } from "../data/steps";
import type { IStep } from "../types";

export default function ProcessSection() {
  return (
    <section className="py-24 bg-background">
      <Wrapper>
        {/* Header */}
        <motion.h2
          className="text-center text-[clamp(2.25rem,4vw,3.5rem)] font-semibold tracking-[-0.03em] text-text-primary"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
          Four Steps to <span className="text-primary">Perfection.</span>
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-xl text-center text-text-secondary"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 240,
            damping: 70,
            mass: 1,
          }}
        >
          A streamlined workflow designed for maximum efficiency.
        </motion.p>

        {/* Steps */}
        <div className="relative mt-14">
          {/* Connector line — sits behind the cards, visible only in the gaps */}
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-border lg:block" />

          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

const StepCard = ({ step, index }: { step: IStep; index: number }) => {
  const { icon: Icon, title, description } = step;
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      className="group relative rounded-2xl border border-border bg-background-surface p-6 duration-300 transition-[background-color,border-color,box-shadow] hover:border-primary/40 hover:bg-background-card hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.18)]"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 70,
        mass: 1,
      }}
    >
      {/* Step number */}
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-text-muted transition-colors duration-300 group-hover:bg-primary" />
        <span className="text-xs font-medium tracking-widest text-text-muted transition-colors duration-300 group-hover:text-primary">
          {number}
        </span>
      </div>

      <Icon
        size={22}
        strokeWidth={1.75}
        className="mt-8 text-text-primary transition-colors duration-300 group-hover:text-primary"
      />

      <h3 className="mt-6 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </motion.div>
  );
};
