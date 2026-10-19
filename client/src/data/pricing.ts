import { CalendarClock, Coins, RotateCcw, Sparkles } from "lucide-react";
import type { IBillingOption, ICreditFact, IPlanComparisonRow, IPricingPlan } from "../types";
import { FREE_MONTHLY_CREDITS, GENERATION_CREDIT_COST } from "../lib/credits";

const FREE_THUMBNAILS = FREE_MONTHLY_CREDITS / GENERATION_CREDIT_COST;

export const YEARLY_DISCOUNT = 0.2;

// Marks plan features that are announced but not built yet (no plan-based model, queue or Recreate).
const COMING_SOON = "(coming soon)";

export const billingOptions: IBillingOption[] = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
];

// One-time credit packs: each step adds one thumbnail's worth of credits. Mirrors CREDIT_PACK in
// server/src/constants/constants.ts and the Paddle credit pack price (USD 0.25 per 5 credits).
export const CREDIT_PACK = {
    step: GENERATION_CREDIT_COST,
    stepPriceCents: 25,
    min: 25,
    max: 2500,
    initial: 100,
};

export const creditPackFeatures = [
    "No monthly subscription required",
    "Credits never expire",
    "Every style, color scheme & aspect ratio",
    "Reference image upload",
    "Free AI prompt improver",
    "Failed generations refunded automatically",
];

export const pricingPlans: IPricingPlan[] = [
    {
        id: "free",
        name: "Free",
        tagline: "Perfect for getting started",
        monthlyPrice: 0,
        cta: "Start Free",
        features: [
            `${FREE_MONTHLY_CREDITS} credits every month (${FREE_THUMBNAILS} thumbnails)`,
            "All styles, color schemes & aspect ratios",
            "Reference image upload",
            "AI prompt improver",
            "Publish to the community gallery",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        tagline: "For creators who need more",
        monthlyPrice: 9,
        cta: "Get Pro",
        mostPopular: true,
        features: [
            "500 credits every month (100 thumbnails)",
            "Everything in Free",
            `Premium image model ${COMING_SOON}`,
            `Recreate & modify thumbnails ${COMING_SOON}`,
            `Priority generation ${COMING_SOON}`,
        ],
    },
    {
        id: "ultra",
        name: "Ultra",
        tagline: "For power creators and agencies",
        monthlyPrice: 29,
        cta: "Get Ultra",
        features: [
            "2,500 credits every month (500 thumbnails)",
            "Everything in Pro",
            "Priority support",
            "Early access to new features",
        ],
    },
];

export const creditFacts: ICreditFact[] = [
    {
        icon: Coins,
        title: `${GENERATION_CREDIT_COST} credits per thumbnail`,
        description: "Every generation costs the same, whatever the style, color scheme or size.",
    },
    {
        icon: RotateCcw,
        title: "Failed? Refunded",
        description: "If a generation fails or gets blocked, the credits go straight back to you.",
    },
    {
        icon: CalendarClock,
        title: "Monthly refill",
        description: `Verified free accounts are topped back up to ${FREE_MONTHLY_CREDITS} credits every 30 days.`,
    },
    {
        icon: Sparkles,
        title: "Free prompt improver",
        description: "Rewriting your prompt with AI never costs credits.",
    },
];

export const planComparison: IPlanComparisonRow[] = [
    { feature: "Credits per month", values: [String(FREE_MONTHLY_CREDITS), "500", "2,500"] },
    { feature: "Thumbnails per month", values: [String(FREE_THUMBNAILS), "100", "500"] },
    { feature: "All styles, color schemes & aspect ratios", values: [true, true, true] },
    { feature: "Reference image upload", values: [true, true, true] },
    { feature: "AI prompt improver", values: [true, true, true] },
    { feature: "YouTube preview mockups", values: [true, true, true] },
    { feature: "Community gallery publishing", values: [true, true, true] },
    { feature: `Premium image model ${COMING_SOON}`, values: [false, true, true] },
    { feature: `Recreate & modify thumbnails ${COMING_SOON}`, values: [false, true, true] },
    { feature: `Priority generation ${COMING_SOON}`, values: [false, true, true] },
    { feature: "Priority support", values: [false, false, true] },
    { feature: "Early access to new features", values: [false, false, true] },
];
