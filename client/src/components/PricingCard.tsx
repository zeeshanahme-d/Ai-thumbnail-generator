import { Check, Loader2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import AnimatedValue from "./AnimatedValue";
import { useSession } from "../store/useSessionStore";
import { YEARLY_DISCOUNT } from "../data/pricing";
import { hasLiveSubscription } from "../lib/paddle";
import { useCheckout } from "../core/billing/hooks/use-checkout";
import type { PricingCardProps } from "../types";

export default function PricingCard({ plan, billing }: PricingCardProps) {
    const { id, name, tagline, monthlyPrice, cta, features, mostPopular } = plan;
    const navigate = useNavigate();
    const isAuthenticated = useSession((state) => state.isAuthenticated);
    const user = useSession((state) => state.user);
    const { startCheckout, isPending } = useCheckout();

    const isFree = id === "free";
    const isYearly = billing === "yearly";
    const price = isYearly ? Math.round(monthlyPrice * (1 - YEARLY_DISCOUNT)) : monthlyPrice;

    const subscribed = hasLiveSubscription(user);
    const isCurrentPlan = subscribed && user?.plan === id;

    // One subscription per account: subscribers manage theirs in Settings instead of buying a second one.
    const handleClick = () => {
        if (!isAuthenticated) return navigate("/signup");
        if (isFree) return navigate("/dashboard/generate");
        if (subscribed) return navigate("/dashboard/settings");
        startCheckout({ plan: id, billing });
    };

    const label = isCurrentPlan ? "Current plan" : !isFree && subscribed ? "Manage plan" : cta;

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
                disabled={isPending || isCurrentPlan}
                onClick={handleClick}
            >
                {isPending && <Loader2 size={16} className="animate-spin" />}
                {label}
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
