import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Wrapper from "../components/Wrapper";
import SectionTitle from "../components/SectionTitle";
import BillingToggle from "../components/BillingToggle";
import PricingCard from "../components/PricingCard";
import Reveal from "../components/Reveal";
import { CREDIT_PACK, pricingPlans } from "../data/pricing";
import { FREE_MONTHLY_CREDITS, GENERATION_CREDIT_COST } from "../lib/credits";
import { STAGGER } from "../lib/motion";
import type { BillingPeriod } from "../types";

// The smallest credit pack and what it costs, from the same settings the pack checkout uses.
const smallestPackPrice = ((CREDIT_PACK.min / CREDIT_PACK.step) * CREDIT_PACK.stepPriceCents) / 100;

export default function PricingSection() {
    const [billing, setBilling] = useState<BillingPeriod>("monthly");

    return (
        <section id="pricing" className="scroll-mt-16 py-(--section-y)">
            <Wrapper>
                <SectionTitle
                    align="split"
                    text1="Pricing"
                    text2={["Start free.", "Pay when you post more."]}
                    text3={`${FREE_MONTHLY_CREDITS} free credits a month once your email is verified. Every thumbnail costs ${GENERATION_CREDIT_COST}, whatever the style or size.`}
                />

                <div className="mt-12 flex flex-wrap items-center justify-between gap-4 lg:mt-16">
                    <BillingToggle billing={billing} onChange={setBilling} className="" />
                    <Link
                        to="/pricing"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                    >
                        Compare all plan features
                        <ArrowRight size={15} />
                    </Link>
                </div>

                <div className="mt-6 grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                    {pricingPlans.map((plan, index) => (
                        <Reveal key={plan.name} delay={index * STAGGER}>
                            <PricingCard plan={plan} billing={billing} />
                        </Reveal>
                    ))}
                </div>

                <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-6 text-sm text-text-secondary">
                    <span>
                        Need a few more? Credit packs start at{" "}
                        <span className="tabular-nums text-text-primary">${smallestPackPrice.toFixed(2)}</span> for{" "}
                        {CREDIT_PACK.min} credits and never expire.
                    </span>
                    <Link
                        to="/pricing"
                        className="inline-flex items-center gap-1 font-medium text-text-primary underline-offset-4 hover:underline"
                    >
                        See credit packs
                        <ArrowRight size={14} />
                    </Link>
                </p>
            </Wrapper>
        </section>
    );
}
