import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3 } from "lucide-react";
import Wrapper from "../components/Wrapper";
import PreviewCard from "./components/PreviewCard";
import CtrStatCard from "./components/CtrStatCard";

export default function CTASection() {
  return (
    <section className="py-24">
      <Wrapper>
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-border bg-background-surface px-6 py-20 md:px-16"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
        >
          <PreviewCard className="pointer-events-none absolute left-8 top-10 hidden -rotate-6 opacity-60 lg:block" />
          <CtrStatCard className="pointer-events-none absolute bottom-10 right-8 hidden rotate-3 opacity-70 lg:block" />

          <div className="relative mx-auto flex max-w-xl flex-col items-center text-center">
            <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary">
              <BarChart3 size={14} />
              BOOST YOUR CTR
            </span>
            <h2 className="mt-6 text-[clamp(2.25rem,4vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em] text-text-primary">
              Your Best Thumbnails Are Just{" "}
              <span className="text-primary">One Click Away.</span>
            </h2>
            <p className="mt-5 text-text-secondary">
              Join 50,000+ creators generating professional thumbnails in
              seconds. No credit card required.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                to="/generate"
                className="flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-text-on-primary transition-all hover:scale-105 hover:bg-primary-hover active:scale-95"
              >
                Generate for Free
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/community"
                className="rounded-full border border-border bg-background-surface-2 px-8 py-3.5 text-sm font-medium text-text-primary transition hover:bg-background-card"
              >
                Browse Gallery
              </Link>
            </div>
          </div>
        </motion.div>
      </Wrapper>
    </section>
  );
}
