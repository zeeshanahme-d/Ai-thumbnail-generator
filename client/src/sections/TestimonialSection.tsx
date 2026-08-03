import { motion } from "motion/react";
import TestimonialCard from "../components/TestimonialCard";
import Wrapper from "../components/Wrapper";
import { testimonialsData } from "../data/testimonial";
import type { ITestimonial } from "../types";
import Marquee from "react-fast-marquee";
import { useTheme } from "../store/useTheme";

export default function TestimonialSection() {
  const { theme } = useTheme();
  const gradientColor = theme === "dark" ? "#0a0a0a" : "#f9fafb";
  return (
    <section className="py-24">
      <Wrapper>
        <motion.span
          className="mx-auto block w-max rounded-full border border-border bg-background-card px-4 py-1.5 text-xs font-medium text-text-secondary shadow-sm"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          Testimonial
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
          Loved by <span className="text-primary">50,000+</span> Creators.
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
          Join thousands of creators who've transformed their content with
          Thumblify.
        </motion.p>

        <Marquee
          className="max-w-6xl mx-auto mt-11"
          speed={25}
          gradient={true}
          gradientWidth={300}
          gradientColor={gradientColor}
        >
          <div className="flex items-center justify-center py-5 overflow-hidden">
            {[...testimonialsData, ...testimonialsData].map(
              (testimonial: ITestimonial, index: number) => (
                <TestimonialCard
                  key={index}
                  index={index}
                  testimonial={testimonial}
                />
              ),
            )}
          </div>
        </Marquee>
        <Marquee
          className="max-w-6xl mx-auto"
          gradient={true}
          speed={25}
          gradientWidth={300}
          gradientColor={gradientColor}
        >
          <div className="flex items-center justify-center py-5 overflow-hidden">
            {[...testimonialsData, ...testimonialsData].map(
              (testimonial: ITestimonial, index: number) => (
                <TestimonialCard
                  key={index}
                  index={index}
                  testimonial={testimonial}
                />
              ),
            )}
          </div>
        </Marquee>
      </Wrapper>
    </section>
  );
}
