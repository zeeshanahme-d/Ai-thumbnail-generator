import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Wrapper from "../components/Wrapper";
import Eyebrow from "../components/Eyebrow";
import MaskedLines from "../components/MaskedLines";
import Reveal from "../components/Reveal";
import { sampleThumbnails } from "../data/hero";
import { buttonClasses } from "../lib/buttonClasses";
import { FREE_MONTHLY_CREDITS, GENERATION_CREDIT_COST } from "../lib/credits";

const FREE_THUMBNAILS = FREE_MONTHLY_CREDITS / GENERATION_CREDIT_COST;

// Four 16:9 samples for the panel's edge, in two offset columns.
const panelThumbnails = sampleThumbnails.filter(({ width, height }) => width !== height).slice(0, 4);

export default function CTASection() {
  return (
    <section className="pb-(--section-y)">
      <Wrapper>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-background-card shadow-card">
            <div aria-hidden="true" className="public-grid-bg pointer-events-none absolute inset-0" />
            <div aria-hidden="true" className="public-grain pointer-events-none absolute inset-0" />

            <div className="relative grid lg:grid-cols-12">
              <div className="p-6 sm:p-10 lg:col-span-7 lg:p-14">
                <Eyebrow dot>Free to start</Eyebrow>
                <h2 className="mt-5 text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.035em] text-text-primary">
                  <MaskedLines lines={["Your next upload", "needs a thumbnail."]} />
                </h2>
                <p className="mt-5 max-w-[46ch] text-pretty text-base leading-relaxed text-text-secondary">
                  Describe the video and have its thumbnail before you hit publish. No card needed:{" "}
                  {FREE_THUMBNAILS} free thumbnails a month once your email is verified.
                </p>
                <Link
                  to="/dashboard/generate"
                  className={buttonClasses({ size: "lg", rounded: "lg", fullWidth: false, className: "mt-8 max-sm:w-full" })}
                >
                  Start generating free
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Sample thumbnails running off the panel's right edge; decoration only. */}
              <div aria-hidden="true" className="relative hidden lg:col-span-5 lg:block">
                <div className="absolute -right-10 top-10 grid w-[130%] grid-cols-2 gap-4">
                  {panelThumbnails.map(({ src }, index) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={357}
                      className={`aspect-video w-full rounded-xl border border-border object-cover ${index % 2 ? "translate-y-10" : ""}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Wrapper>
    </section>
  );
}
