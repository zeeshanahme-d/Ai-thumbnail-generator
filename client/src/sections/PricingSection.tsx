import { useState } from "react";
import { motion } from "motion/react";
import { Check, Star, Zap } from "lucide-react";
import Wrapper from "../components/Wrapper";
import Button from "../components/Button";
import SectionTitle from "../components/SectionTitle";
import { pricingPlans } from "../data/pricing";
import type { BillingPeriod, PricingCardProps } from "../types";

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
                        <PricingCard key={plan.name} plan={plan} billing={billing} index={index} />
                    ))}
                </div>
            </Wrapper>
        </section>
    );
}

const BillingToggle = ({
    billing,
    onChange,
}: {
    billing: BillingPeriod;
    onChange: (value: BillingPeriod) => void;
}) => {
    const isYearly = billing === "yearly";

    return (
        <div className="mx-auto mt-8 flex w-max items-center gap-1 rounded-full border border-border bg-background-card p-1">
            <button
                type="button"
                onClick={() => onChange("monthly")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${!isYearly ? "bg-primary text-text-on-primary" : "text-text-secondary hover:text-text-primary"}`}
            >
                Monthly
            </button>
            <button
                type="button"
                onClick={() => onChange("yearly")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${isYearly ? "bg-primary text-text-on-primary" : "text-text-secondary hover:text-text-primary"}`}
            >
                Yearly
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${isYearly ? "bg-white/20 text-text-on-primary" : "bg-primary/10 text-primary"}`}>
                    -20%
                </span>
            </button>
        </div>
    );
};

const PricingCard = ({ plan, billing, index }: PricingCardProps) => {
    const { name, tagline, monthlyPrice, cta, features, mostPopular } = plan;
    const price = billing === "yearly" ? Math.round(monthlyPrice * 0.8) : monthlyPrice;
    const suffix = monthlyPrice === 0 ? "forever" : "/month";

    return (
        <motion.div
            className={`relative rounded-2xl border p-6 lg:p-8 ${mostPopular
                ? "border-primary bg-background-surface shadow-[0_20px_50px_-20px_rgba(230,57,70,0.35)]"
                : "border-border bg-background-card"
                }`}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 70, mass: 1 }}
        >
            {mostPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-medium text-text-on-primary">
                        <Star size={12} className="fill-current" />
                        Most Popular
                    </span>
                </div>
            )}

            <h3 className="text-xl font-semibold text-text-primary lg:text-2xl">{name}</h3>
            <p className="mt-1 text-sm text-text-secondary">{tagline}</p>

            <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-bold tracking-tight text-text-primary lg:text-5xl">${price}</span>
                <span className="mb-1.5 text-sm text-text-muted">{suffix}</span>
            </div>

            <Button
                type="button"
                variant={mostPopular ? "primary" : "outline"}
                rounded="lg"
                className="mt-6"
            >
                {cta}
                {mostPopular && <Zap size={15} className="fill-current" />}
            </Button>

            <ul className="mt-8 space-y-3">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
                        <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                        {feature}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};
