import type { IFaq } from "../types";
import { FREE_MONTHLY_CREDITS, GENERATION_CREDIT_COST } from "../lib/credits";
import { ACCEPTED_IMAGE_LABEL, MAX_IMAGE_SIZE_MB } from "../lib/imageValidation";
import { THUMBNAIL_FORMATS } from "./generator";
import { CREDIT_PACK, YEARLY_DISCOUNT } from "./pricing";

const formatList = new Intl.ListFormat("en", { type: "conjunction" }).format(
    THUMBNAIL_FORMATS.map(({ name, aspectRatio }) => `${name} (${aspectRatio})`),
);

export const generalFaqs: IFaq[] = [
    {
        question: "What is Eyecatch AI?",
        answer:
            "Eyecatch AI turns a short description of your video into a ready-to-use thumbnail. Pick a platform, category, style and color scheme, optionally add a reference image, and Google's Gemini AI generates it in seconds.",
    },
    {
        question: "Is Eyecatch AI free?",
        answer: `Yes. Verify your email and you get ${FREE_MONTHLY_CREDITS} free credits, topped back up every 30 days. Each thumbnail costs ${GENERATION_CREDIT_COST} credits and no credit card is needed.`,
    },
    {
        question: "Which platforms and sizes can I create?",
        answer: `${formatList}. Every format costs the same number of credits.`,
    },
    {
        question: "Can I use my own image as a reference?",
        answer: `Yes. Upload a ${ACCEPTED_IMAGE_LABEL} image up to ${MAX_IMAGE_SIZE_MB} MB and the AI uses it as a guide for faces, products or layout. It is sent to the AI for that generation only and never stored.`,
    },
    {
        question: "Are my thumbnails public?",
        answer:
            "No. New thumbnails stay private in your gallery. Publish one to share it in the community gallery, and unpublish it whenever you like.",
    },
    {
        question: "Can I use the thumbnails commercially?",
        answer:
            "Yes. You can use the thumbnails you generate on your videos and channels, including monetized ones, as long as you follow our Terms & Conditions.",
    },
    {
        question: "What happens when I delete a thumbnail?",
        answer:
            "It moves to the recycle bin, where you can restore it for 30 days. After that it is deleted for good, along with its image.",
    },
    {
        question: "Can I see how it looks on YouTube?",
        answer:
            "Yes. Open any thumbnail in the YouTube preview to see it next to other videos on the home page, in search and on mobile, in light or dark mode.",
    },
];

export const pricingFaqs: IFaq[] = [
    {
        question: "How do credits work?",
        answer: `Every thumbnail costs ${GENERATION_CREDIT_COST} credits. Improving your prompt with AI is free. Your balance is always shown in the dashboard and in Settings.`,
    },
    {
        question: "What are credit packs?",
        answer: `A one-time top-up with no subscription. Pick exactly how many credits you need at $${(CREDIT_PACK.stepPriceCents / 100).toFixed(2)} for every ${CREDIT_PACK.step} credits, and bought credits never expire. Your monthly credits are always used first. If you create a lot, a plan costs less per credit.`,
    },
    {
        question: "Do unused credits roll over?",
        answer: `Monthly credits don't. Every 30 days a verified free account is topped back up to ${FREE_MONTHLY_CREDITS} credits, so unused monthly credits don't stack. Credits you buy in a pack never expire.`,
    },
    {
        question: "What if a generation fails?",
        answer:
            "You get your credits back automatically. If a generation is interrupted, it is refunded within about 10 minutes.",
    },
    {
        question: "Why do I need to verify my email?",
        answer:
            "Free credits unlock once your email is verified. It keeps the free plan fair by stopping throwaway accounts.",
    },
    {
        question: "Can I buy credits or a plan today?",
        answer: `You can try it, but payments run in Paddle's test mode because Eyecatch AI is a portfolio project. Use the test card shown before checkout, never a real card, and no money is charged. Bought credits and plans appear in Settings but can't be spent; thumbnails always use your ${FREE_MONTHLY_CREDITS} free monthly credits.`,
    },
    {
        question: "How does yearly billing work?",
        answer: `Yearly plans cost ${YEARLY_DISCOUNT * 100}% less than paying monthly and are billed once a year. Your credits still arrive every month.`,
    },
    {
        question: "Can I cancel anytime?",
        answer:
            "Yes. Cancel from Settings > Manage plan. Cancelling stops the next renewal and you keep your plan until the end of the period you paid for. See the Refund Policy for details.",
    },
    {
        question: "Do I need a credit card for the free plan?",
        answer: "No. Sign up with your email, verify it, and start generating.",
    },
];
