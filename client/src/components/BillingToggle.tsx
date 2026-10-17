import { useId } from "react";
import { motion } from "motion/react";
import { billingOptions, YEARLY_DISCOUNT } from "../data/pricing";
import type { BillingToggleProps } from "../types";

export default function BillingToggle({ billing, onChange }: BillingToggleProps) {
    const pillId = useId();

    return (
        <div className="mx-auto mt-8 flex w-max items-center gap-1 rounded-full border border-border bg-background-card p-1">
            {billingOptions.map(({ value, label }) => {
                const isActive = billing === value;

                return (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onChange(value)}
                        className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${isActive ? "text-text-on-primary" : "text-text-secondary hover:text-text-primary"}`}
                    >
                        {isActive && (
                            <motion.span
                                layoutId={pillId}
                                className="absolute inset-0 rounded-full bg-primary"
                                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                            />
                        )}
                        <span className="relative">{label}</span>
                        {value === "yearly" && (
                            <span className={`relative rounded-full px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${isActive ? "bg-white/20 text-text-on-primary" : "bg-primary/10 text-primary"}`}>
                                -{YEARLY_DISCOUNT * 100}%
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
