import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import toast from "react-hot-toast";
import Wrapper from "../../components/Wrapper";
import Alert from "../../components/Alert";
import Eyebrow from "../../components/Eyebrow";
import PageHeader from "../../components/PageHeader";
import BillingToggle from "../../components/BillingToggle";
import PricingCard from "../../components/PricingCard";
import Reveal from "../../components/Reveal";
import CreditPackCard from "./components/CreditPackCard";
import CreditFacts from "./components/CreditFacts";
import PlanComparison from "./components/PlanComparison";
import PricingFaq from "./components/PricingFaq";
import { pricingPlans } from "../../data/pricing";
import { FREE_MONTHLY_CREDITS } from "../../lib/credits";
import { STAGGER } from "../../lib/motion";
import { getPaddle } from "../../lib/paddle";
import type { BillingPeriod } from "../../types";

export default function Pricing() {
    const [billing, setBilling] = useState<BillingPeriod>("monthly");

    // This page is Paddle's default payment link: its links and "update payment method" emails
    // land here with ?_ptxn=. Loading Paddle.js is enough, it opens that transaction's checkout itself.
    useEffect(() => {
        if (new URLSearchParams(window.location.search).has("_ptxn")) {
            getPaddle().catch(() => toast.error("Checkout couldn't load. Please try again."));
        }
    }, []);

    return (
        // "user": with reduced motion on, transforms are skipped and content appears in place.
        <MotionConfig reducedMotion="user">
            <main>
                <PageHeader
                    animate
                    eyebrow="Pricing"
                    title={["Pay for what", "you need."]}
                    description={`Start free with ${FREE_MONTHLY_CREDITS} credits every month once your email is verified. Top up anytime, or subscribe and save.`}
                />

                <Wrapper>
                    <Alert variant="info" className="mb-6">
                        Test mode: Eyecatch AI is a portfolio project, so checkout runs in Paddle's test mode and no
                        money is charged. Pay with the test card shown before checkout, never your real card. Credits
                        you buy are shown in Settings but can't be spent; thumbnails use your{" "}
                        {FREE_MONTHLY_CREDITS} free monthly credits.
                    </Alert>
                    <Reveal>
                        <CreditPackCard />
                    </Reveal>

                    <div className="mt-16 flex items-center gap-4 md:mt-20">
                        <span className="h-px flex-1 bg-border" />
                        <Eyebrow>Or subscribe and save</Eyebrow>
                        <span className="h-px flex-1 bg-border" />
                    </div>

                    <BillingToggle billing={billing} onChange={setBilling} />

                    <div className="mt-10 grid grid-cols-1 items-start gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                        {pricingPlans.map((plan, index) => (
                            <Reveal key={plan.name} delay={index * STAGGER}>
                                <PricingCard plan={plan} billing={billing} />
                            </Reveal>
                        ))}
                    </div>
                </Wrapper>

                <CreditFacts />
                <PlanComparison />
                <PricingFaq />
            </main>
        </MotionConfig>
    );
}
