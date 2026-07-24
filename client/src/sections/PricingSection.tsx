import { useState } from "react";
import { motion } from "motion/react";
import { Check, Star, Zap } from "lucide-react";
import Wrapper from "../components/Wrapper";
import { pricingPlans } from "../data/pricing";
import type { BillingPeriod, PricingCardProps } from "../types";

export default function PricingSection() {
    const [billing, setBilling] = useState<BillingPeriod>("monthly");

    return (
        <section id="pricing" className="py-24">
            <Wrapper>
                <motion.h2
                    className="text-center text-[clamp(2.25rem,4vw,3.5rem)] font-semibold tracking-[-0.03em] text-text-primary"
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    Clear, <span className="text-primary">Transparent</span> Pricing.
                </motion.h2>
                <motion.p
                    className="mx-auto mt-4 max-w-xl text-center text-text-secondary"
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                >
                    Start free, upgrade when you need more. Cancel anytime.
                </motion.p>

                <BillingToggle billing={billing} onChange={setBilling} />

                <div className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
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
        <div className="mx-auto mt-10 flex w-max items-center gap-1 rounded-full border border-border bg-background-card p-1">
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
            className={`relative rounded-2xl border p-8 ${mostPopular
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
                    <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-text-on-primary">
                        <Star size={12} className="fill-current" />
                        Most Popular
                    </span>
                </div>
            )}

            <h3 className="text-2xl font-semibold text-text-primary">{name}</h3>
            <p className="mt-1 text-sm text-text-secondary">{tagline}</p>

            <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-bold tracking-tight text-text-primary">${price}</span>
                <span className="mb-1.5 text-sm text-text-muted">{suffix}</span>
            </div>

            <button
                type="button"
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all active:scale-[0.98] ${mostPopular
                    ? "bg-primary text-text-on-primary hover:bg-primary-hover"
                    : "border border-border text-text-primary hover:bg-background-surface-2"
                    }`}
            >
                {cta}
                {mostPopular && <Zap size={15} className="fill-current" />}
            </button>

            <ul className="mt-8 space-y-3">
                {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-text-secondary">
                        <Check size={16} className="shrink-0 text-primary" />
                        {feature}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};
