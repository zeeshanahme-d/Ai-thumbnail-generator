import TestimonialCard from "../components/TestimonialCard";
import Wrapper from "../components/Wrapper";
import SectionTitle from "../components/SectionTitle";
import { testimonialsData } from "../data/testimonial";
import type { ITestimonial } from "../types";
import Marquee from "react-fast-marquee";

export default function TestimonialSection() {
  return (
    <section className="py-16 md:py-24">
      <Wrapper>
        <SectionTitle
          text1="Testimonial"
          text2={<>Loved by <span className="text-primary">50,000+</span> Creators.</>}
          text3="Join thousands of creators who've transformed their content with Thumblify."
        />

        <div className="mx-auto mt-8 max-w-6xl md:mt-12">
          {(["left", "right"] as const).map((direction) => (
            <Marquee
              key={direction}
              className="marquee-fade"
              direction={direction}
              speed={25}
            >
              <div className="flex items-center justify-center overflow-hidden py-3">
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
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
