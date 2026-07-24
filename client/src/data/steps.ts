import { Cpu, Image, MessageSquare, Rocket } from "lucide-react";
import type { IStep } from "../types";

export const steps: IStep[] = [
    {
        icon: MessageSquare,
        title: "The Prompt",
        description: "Describe your vision in plain English. No complex prompting required.",
    },
    {
        icon: Cpu,
        title: "The Engine",
        description: "Select from 10+ highly-tuned style architectures to match your brand.",
    },
    {
        icon: Image,
        title: "The Render",
        description: "Watch as our AI generates a pristine, high-conversion thumbnail in seconds.",
    },
    {
        icon: Rocket,
        title: "The Launch",
        description: "Export in 4K resolution or publish directly to our creator gallery.",
    },
];
