import { useState } from "react";
import Wrapper from "../../components/Wrapper";
import SectionTitle from "../../components/SectionTitle";
import BillingToggle from "../../components/BillingToggle";
import PricingCard from "../../components/PricingCard";
import Reveal from "../../components/Reveal";
import CreditPackCard from "./components/CreditPackCard";
import CreditFacts from "./components/CreditFacts";
import PlanComparison from "./components/PlanComparison";
import PricingFaq from "./components/PricingFaq";
import { pricingPlans } from "../../data/pricing";
import { FREE_MONTHLY_CREDITS } from "../../lib/credits";
import type { BillingPeriod } from "../../types";

export default function Pricing() {
    const [billing, setBilling] = useState<BillingPeriod>("monthly");

    return (
        <main className="relative isolate overflow-hidden py-12 md:py-20">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-56 left-1/2 -z-10 size-125 -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]"
            />

            <Wrapper>
                <SectionTitle
                    as="h1"
                    text1="Pricing"
                    text2={<>Pay for <span className="text-primary">what you need.</span></>}
                    text3={`Start free with ${FREE_MONTHLY_CREDITS} credits every month. Top up anytime, or subscribe and save.`}
                />

                <Reveal className="mx-auto mt-12 max-w-5xl md:mt-14">
                    <CreditPackCard />
                </Reveal>

                <div className="mx-auto mt-16 flex max-w-5xl items-center gap-4 text-xs font-semibold uppercase tracking-widest text-text-muted md:mt-20">
                    <span className="h-px flex-1 bg-border" />
                    Or subscribe and save
                    <span className="h-px flex-1 bg-border" />
                </div>

                <BillingToggle billing={billing} onChange={setBilling} />

                <div className="mx-auto mt-10 grid max-w-md grid-cols-1 items-start gap-6 md:mt-12 lg:max-w-none lg:grid-cols-3">
                    {pricingPlans.map((plan, index) => (
                        <Reveal key={plan.name} delay={index * 0.1}>
                            <PricingCard plan={plan} billing={billing} />
                        </Reveal>
                    ))}
                </div>

                <CreditFacts />
                <PlanComparison />
                <PricingFaq />
            </Wrapper>
        </main>
    );
}
