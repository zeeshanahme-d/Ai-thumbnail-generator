import type { IPricingPlan } from "../types";

export const pricingPlans: IPricingPlan[] = [
    {
        name: "Free",
        tagline: "Perfect for getting started",
        monthlyPrice: 0,
        cta: "Start Free",
        features: [
            "5 generations per month",
            "Standard quality",
            "16:9 & 1:1 aspect ratios",
            "Community gallery access",
            "Basic style presets",
        ],
    },
    {
        name: "Pro",
        tagline: "For creators who need more",
        monthlyPrice: 9,
        cta: "Get Pro",
        mostPopular: true,
        features: [
            "100 generations per month",
            "HD & Ultra quality",
            "All aspect ratios",
            "Image upload & blending",
            "All style presets",
            "Recreate & modify thumbnails",
            "Priority generation",
            "Download without watermark",
        ],
    },
    {
        name: "Ultra",
        tagline: "For power creators and agencies",
        monthlyPrice: 29,
        cta: "Get Ultra",
        features: [
            "500 generations per month",
            "Ultra quality always",
            "All style presets",
            "API access",
            "Priority support",
            "Commercial license",
        ],
    },
];
