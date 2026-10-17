import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Wrapper from "../components/Wrapper";
import SectionTitle from "../components/SectionTitle";
import BillingToggle from "../components/BillingToggle";
import PricingCard from "../components/PricingCard";
import Reveal from "../components/Reveal";
import { pricingPlans } from "../data/pricing";
import type { BillingPeriod } from "../types";

export default function PricingSection() {
    const [billing, setBilling] = useState<BillingPeriod>("monthly");

    return (
        <section id="pricing" className="scroll-mt-24 py-16 md:py-24">
            <Wrapper>
                <SectionTitle
                    text2={<>Clear, <span className="text-primary">Transparent</span> Pricing.</>}
                    text3="Start free, upgrade when you need more. Cancel anytime."
                />

                <BillingToggle billing={billing} onChange={setBilling} />

                <div className="mx-auto mt-10 grid max-w-md grid-cols-1 items-start gap-6 md:mt-12 lg:max-w-none lg:grid-cols-3">
                    {pricingPlans.map((plan, index) => (
                        <Reveal key={plan.name} delay={index * 0.1}>
                            <PricingCard plan={plan} billing={billing} />
                        </Reveal>
                    ))}
                </div>

                <Link
                    to="/pricing"
                    className="mx-auto mt-10 flex w-max items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                    Compare all plan features
                    <ArrowRight size={15} />
                </Link>
            </Wrapper>
        </section>
    );
}
