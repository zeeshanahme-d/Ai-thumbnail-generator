import { useState } from "react";
import { Check, Minus, Plus, Sparkles } from "lucide-react";
import Button from "../../../components/Button";
import AnimatedValue from "../../../components/AnimatedValue";
import { CREDIT_PACK, creditPackFeatures } from "../../../data/pricing";
import { GENERATION_CREDIT_COST } from "../../../lib/credits";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const clamp = (credits: number) => Math.min(CREDIT_PACK.max, Math.max(CREDIT_PACK.min, credits));

export default function CreditPackCard() {
    const [credits, setCredits] = useState(CREDIT_PACK.initial);

    const price = usd.format((credits / CREDIT_PACK.step) * CREDIT_PACK.stepPriceCents / 100);
    const thumbnails = credits / GENERATION_CREDIT_COST;
    const changeBy = (delta: number) => setCredits((current) => clamp(current + delta));

    return (
        <div className="grid overflow-hidden rounded-3xl border border-border bg-background-card shadow-[0_24px_60px_-32px_rgba(0,0,0,0.3)] md:grid-cols-2">
            <div className="p-6 sm:p-8 lg:p-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Sparkles size={13} />
                    Pay as you go
                </span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">Thumblify Credits</h2>
                <p className="mt-1 text-sm text-text-secondary">Only pay for what you use.</p>

                <ul className="mt-6 space-y-3">
                    {creditPackFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary sm:text-base">
                            <Check size={18} className="mt-0.5 shrink-0 text-primary" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col justify-center border-t border-border bg-background-surface p-6 sm:p-8 md:border-l md:border-t-0 lg:p-10">
                <div className="flex items-end gap-4">
                    <AnimatedValue
                        value={price}
                        className="text-5xl font-bold tracking-tight text-text-primary tabular-nums lg:text-6xl"
                    />
                    <p className="pb-1.5 text-sm leading-snug text-text-muted">
                        {credits.toLocaleString("en-US")} credits
                        <br />
                        Pay once
                    </p>
                </div>

                <p className="mt-4 text-sm text-text-secondary sm:text-base">
                    Generate up to{" "}
                    <AnimatedValue value={thumbnails} className="font-semibold text-primary tabular-nums" />{" "}
                    thumbnails anytime.
                </p>

                <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center gap-1 rounded-xl border border-border bg-background-card p-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            rounded="lg"
                            aria-label={`Remove ${CREDIT_PACK.step} credits`}
                            disabled={credits <= CREDIT_PACK.min}
                            onClick={() => changeBy(-CREDIT_PACK.step)}
                        >
                            <Minus size={16} />
                        </Button>
                        <output aria-live="polite" className="min-w-18 text-center text-xl font-semibold text-text-primary">
                            <AnimatedValue value={credits.toLocaleString("en-US")} className="tabular-nums" />
                        </output>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            rounded="lg"
                            aria-label={`Add ${CREDIT_PACK.step} credits`}
                            disabled={credits >= CREDIT_PACK.max}
                            onClick={() => changeBy(CREDIT_PACK.step)}
                        >
                            <Plus size={16} />
                        </Button>
                    </div>
                    <span className="text-sm font-medium text-text-primary">AI credits</span>
                </div>

                <input
                    type="range"
                    min={CREDIT_PACK.min}
                    max={CREDIT_PACK.max}
                    step={CREDIT_PACK.step}
                    value={credits}
                    onChange={(event) => setCredits(Number(event.target.value))}
                    aria-label="Number of credits"
                    className="mt-6 w-full cursor-pointer accent-primary"
                />
                <div className="mt-1 flex justify-between text-xs text-text-muted">
                    <span>{CREDIT_PACK.min}</span>
                    <span>{CREDIT_PACK.max.toLocaleString("en-US")}</span>
                </div>

                <Button type="button" variant="primary" className="mt-6" disabled>
                    Coming soon
                </Button>
                <p className="mt-3 text-center text-xs text-text-muted">One-time purchase. No monthly fees.</p>
            </div>
        </div>
    );
}
