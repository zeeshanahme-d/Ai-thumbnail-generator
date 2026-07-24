import { motion } from "motion/react";
import Wrapper from "../components/Wrapper";
import { capabilities } from "../data/capabilities";
import type { ICapability } from "../types";

export default function CapabilitiesSection() {
  return (
    <section className="py-24">
      <Wrapper>
        {/* Header */}
        <motion.span
          className="mx-auto block w-max rounded-full border border-border bg-background-card px-4 py-1.5 text-xs font-medium text-text-secondary shadow-sm"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          Capabilities
        </motion.span>
        <motion.h2
          className="mt-6 text-center text-[clamp(2.25rem,4vw,3.5rem)] font-semibold tracking-[-0.03em] text-text-primary"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.05,
            type: "spring",
            stiffness: 280,
            damping: 70,
            mass: 1,
          }}
        >
          Built for <span className="text-primary">Performance.</span>
        </motion.h2>
        <motion.p
          className="mx-auto mt-2 max-w-xl text-center text-text-secondary"
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
          Every feature is engineered to maximize your click-through rate.
          High-end AI, lightning-fast generation, and zero compromises.
        </motion.p>

        {/* Bento grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {capabilities.map((cap, index) => (
            <CapabilityCard key={cap.title} capability={cap} index={index} />
          ))}
        </div>
      </Wrapper>
    </section>
  );
}

const CapabilityCard = ({
  capability,
  index,
}: {
  capability: ICapability;
  index: number;
}) => {
  const { icon: Icon, title, description, span, visual } = capability;
  const isWide = span === "wide";

  return (
    <motion.div
      className={`group rounded-2xl border border-border bg-background-card p-6 hover:border-primary/40 duration-300 transition-[background-color,border-color,box-shadow] hover:bg-background-card hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.18)] md:p-8 ${
        isWide ? "md:col-span-2" : "md:col-span-1"
      }`}
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
      <div
        className={`flex h-full flex-col gap-6 ${isWide ? "sm:flex-row sm:items-center" : ""}`}
      >
        {/* Text block */}
        <div className={isWide ? "sm:flex-1" : ""}>
          <div className="inline-flex size-11 items-center justify-center rounded-xl bg-background-surface-2 text-text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-text-on-primary">
            <Icon size={20} />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-text-primary">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        </div>

        {/* Decorative visual (wide cards only) */}
        {visual && (
          <div className="flex min-h-[180px] items-center justify-center sm:flex-1">
            <CapabilityVisual visual={visual} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CapabilityVisual = ({
  visual,
}: {
  visual: NonNullable<ICapability["visual"]>;
}) => {
  if (visual === "canvas") {
    return (
      <motion.div
        className="size-40 rounded-md border-2 border-primary/70 transition-shadow duration-500 group-hover:shadow-[0_0_25px_-4px_rgba(230,57,70,0.55)]"
        animate={{ rotate: [6, -5, 6], y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  // upscale: HD | 4K ULTRA split with a divider that reveals on hover
  return (
    <div className="flex h-32 w-64 overflow-hidden rounded-xl border border-border bg-background-surface">
      <div className="flex flex-1 items-center justify-center">
        <span className="text-xl font-bold text-text-muted blur-[2px]">HD</span>
      </div>
      <div className="w-0.5 origin-center scale-y-0 bg-primary transition-transform duration-500 group-hover:scale-y-100" />
      <div className="flex flex-1 items-center justify-center">
        <span className="text-xl font-extrabold tracking-tight text-primary">
          4K ULTRA
        </span>
      </div>
    </div>
  );
};
