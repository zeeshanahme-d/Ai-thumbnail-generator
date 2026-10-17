import { Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import AnimatedValue from "./AnimatedValue";
import { useSession } from "../store/useSessionStore";
import { YEARLY_DISCOUNT } from "../data/pricing";
import type { PricingCardProps } from "../types";

export default function PricingCard({ plan, billing }: PricingCardProps) {
    const { name, tagline, monthlyPrice, cta, features, mostPopular } = plan;
    const navigate = useNavigate();
    const isAuthenticated = useSession((state) => state.isAuthenticated);

    const isFree = monthlyPrice === 0;
    const isYearly = billing === "yearly";
    const price = isYearly ? Math.round(monthlyPrice * (1 - YEARLY_DISCOUNT)) : monthlyPrice;

    return (
        <div
            className={`relative rounded-2xl border p-6 lg:p-8 ${mostPopular
                ? "border-primary bg-background-surface shadow-[0_20px_50px_-20px_rgba(230,57,70,0.35)]"
                : "border-border bg-background-card"
                }`}
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
                <AnimatedValue
                    value={`$${price}`}
                    className="text-4xl font-bold tracking-tight text-text-primary tabular-nums lg:text-5xl"
                />
                <span className="mb-1.5 text-sm text-text-muted">{isFree ? "forever" : "/month"}</span>
            </div>
            <p className="mt-1 min-h-4 text-xs text-text-muted">
                {isYearly && !isFree && `Billed $${price * 12} yearly`}
            </p>

            <Button
                type="button"
                variant={mostPopular ? "primary" : "outline"}
                rounded="lg"
                className="mt-5"
                disabled={!isFree}
                onClick={() => navigate(isAuthenticated ? "/dashboard/generate" : "/signup")}
            >
                {isFree ? cta : "Coming soon"}
            </Button>

            <ul className="mt-8 space-y-3">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
                        <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
}
