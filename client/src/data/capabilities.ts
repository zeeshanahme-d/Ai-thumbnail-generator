import { Crown, Layers, Palette, Zap } from "lucide-react";
import type { ICapability } from "../types";

// Bento order: wide, narrow, narrow, wide → row 1 [wide | narrow], row 2 [narrow | wide].
export const capabilities: ICapability[] = [
    {
        icon: Palette,
        title: "Hyper-Tuned AI Models",
        description:
            "Our proprietary AI isn't just generating images; it's trained on millions of high-performing YouTube thumbnails. It understands composition, eye-tracking, and contrast perfectly.",
        span: "wide",
        visual: "canvas",
    },
    {
        icon: Zap,
        title: "Sub-Second Generation",
        description:
            "Iterate at the speed of thought. Generate multiple variations instantly without breaking your creative flow.",
        span: "narrow",
    },
    {
        icon: Layers,
        title: "Face Blending",
        description:
            "Upload a quick selfie and watch the AI seamlessly blend your face into cinematic, high-quality environments.",
        span: "narrow",
    },
    {
        icon: Crown,
        title: "Ultra HD Upscaling",
        description:
            "Never upload a blurry thumbnail again. Every generation is automatically upscaled to pristine 4K resolution, ensuring maximum sharpness across all devices and screen sizes.",
        span: "wide",
        visual: "upscale",
    },
];
