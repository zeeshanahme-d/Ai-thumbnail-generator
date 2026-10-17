import type { ILegalDocument, LegalDocumentId } from "../types";
import { FREE_MONTHLY_CREDITS, GENERATION_CREDIT_COST } from "../lib/credits";
import { SUPPORT_EMAIL } from "./site";

const UPDATED_AT = "October 17, 2026";

const privacyPolicy: ILegalDocument = {
    id: "privacy",
    title: "Privacy Policy",
    path: "/privacy-policy",
    summary: "What we collect, why we collect it, and the control you have over your data.",
    updatedAt: UPDATED_AT,
    sections: [
        {
            id: "overview",
            title: "Overview",
            paragraphs: [
                "This policy explains how Thumblify (\"we\", \"us\") handles your information when you use our website and AI thumbnail generator. We only collect what we need to run the service, and we never sell your personal information.",
            ],
        },
        {
            id: "information-we-collect",
            title: "Information we collect",
            paragraphs: ["We collect the following information when you use Thumblify:"],
            list: [
                "Account details: your full name, email address, username and password. Passwords are stored as one-way hashes, never as plain text.",
                "Profile details you choose to add: bio, website and profile photo.",
                "Content you create: prompts, titles, the style, aspect ratio and color scheme you pick, and the thumbnails you generate.",
                "Activity: the thumbnails you like or publish, view counts, and your credit balance and usage.",
                "Technical data: your IP address, used to protect sign-in and other features from abuse.",
            ],
        },
        {
            id: "how-we-use-information",
            title: "How we use your information",
            paragraphs: ["We use your information to:"],
            list: [
                "Create and secure your account, and keep you signed in.",
                "Generate thumbnails and store them in your gallery.",
                "Track your credits and apply the monthly refill.",
                "Send verification and password reset codes. We don't send marketing emails.",
                "Show the thumbnails you publish, with your name, username and profile photo, in the community gallery.",
                "Prevent abuse, for example by limiting repeated sign-in attempts and blocking disposable email addresses.",
            ],
        },
        {
            id: "ai-processing",
            title: "AI processing",
            paragraphs: [
                "To generate a thumbnail or improve a prompt, we send your prompt, the options you chose and any reference image to Google's Gemini API. Reference images are used for that single request and are not stored by us.",
                "Google processes this data under its own terms. Please don't include sensitive personal information in your prompts or reference images.",
            ],
        },
        {
            id: "service-providers",
            title: "Service providers",
            paragraphs: [
                "We share data only with the providers we need to run Thumblify. We don't use advertising networks or third-party analytics.",
            ],
            list: [
                "Google Gemini, which generates thumbnails and improves prompts.",
                "Cloudinary, which stores and delivers generated thumbnails and profile photos.",
                "MongoDB, which hosts our database.",
                "Our email provider, which delivers verification and password reset codes.",
            ],
        },
        {
            id: "cookies",
            title: "Cookies and local storage",
            paragraphs: ["We use a small number of cookies and browser storage items, all needed for the service to work:"],
            list: [
                "accessToken (15 minutes) and refreshToken (30 days): secure, http-only cookies that keep you signed in.",
                "visitorId (1 year): lets us count a signed-out visitor's view of a published thumbnail only once.",
                "Local storage: a copy of your basic profile so pages load faster, and your light or dark theme choice.",
                "Session storage: your email address while you finish verifying it or resetting your password.",
            ],
        },
        {
            id: "public-information",
            title: "What other people can see",
            paragraphs: [
                "Thumbnails are private until you publish them. Published thumbnails, their like and view counts, and your public profile (full name, username, profile photo, bio and website) can be seen by anyone. Your email address is never shown publicly.",
            ],
        },
        {
            id: "data-retention",
            title: "How long we keep data",
            paragraphs: ["We keep your information only as long as we need it:"],
            list: [
                "Account data is kept for as long as your account exists.",
                "Deleted thumbnails stay in your recycle bin for 30 days, then are permanently deleted along with their images.",
                "Verification and password reset codes expire after 10 minutes.",
                "Sign-in sessions end after 30 days, when you log out, or when your password changes.",
            ],
        },
        {
            id: "your-choices",
            title: "Your choices and rights",
            paragraphs: [
                "You can update your profile in Settings, unpublish or delete any thumbnail, and change your password at any time.",
                "You can delete your account from Settings. This immediately removes your profile, profile photo, thumbnails and their images, your likes and your sessions. View counts on other people's thumbnails stay as anonymous numbers.",
                `To request a copy of your data or ask a question about it, email us at ${SUPPORT_EMAIL}.`,
            ],
        },
        {
            id: "security",
            title: "Security",
            paragraphs: [
                "We hash passwords and session tokens, keep tokens in http-only cookies, sign you out everywhere when your password changes, and rate-limit sensitive actions. No system is perfectly secure, so please use a strong, unique password.",
            ],
        },
        {
            id: "children",
            title: "Children",
            paragraphs: [
                "Thumblify is not intended for children under 13, or under the minimum age required in your country. We don't knowingly collect their information.",
            ],
        },
        {
            id: "changes",
            title: "Changes to this policy",
            paragraphs: [
                "We may update this policy as Thumblify changes. The date at the top shows the latest version, and we'll let you know about significant changes.",
            ],
        },
        {
            id: "contact",
            title: "Contact us",
            paragraphs: [`Questions about your privacy? Email us at ${SUPPORT_EMAIL}.`],
        },
    ],
};

const termsAndConditions: ILegalDocument = {
    id: "terms",
    title: "Terms & Conditions",
    path: "/terms",
    summary: "The rules for using Thumblify, your account, credits and the thumbnails you create.",
    updatedAt: UPDATED_AT,
    sections: [
        {
            id: "acceptance",
            title: "Acceptance of these terms",
            paragraphs: [
                "By creating an account or using Thumblify, you agree to these Terms & Conditions and our Privacy Policy. If you don't agree, please don't use the service.",
            ],
        },
        {
            id: "your-account",
            title: "Your account",
            paragraphs: [
                "You must be at least 13 years old, or the minimum age in your country, to use Thumblify. Give accurate information, verify your email address and keep your password secure. You are responsible for everything that happens under your account.",
            ],
        },
        {
            id: "credits",
            title: "Credits",
            paragraphs: ["Generating thumbnails uses credits:"],
            list: [
                `Each thumbnail costs ${GENERATION_CREDIT_COST} credits. Improving a prompt with AI is free.`,
                `Verified free accounts receive ${FREE_MONTHLY_CREDITS} credits and are topped back up to ${FREE_MONTHLY_CREDITS} every 30 days. Unused free credits don't roll over.`,
                "If a generation fails, its credits are returned automatically.",
                "Credits have no cash value and can't be transferred, sold or exchanged.",
                "We may change credit costs or allowances. We'll update this page and the pricing page before any change applies.",
            ],
        },
        {
            id: "paid-plans",
            title: "Paid plans and credit packs",
            paragraphs: [
                "Pro and Ultra plans and one-time credit packs are not on sale yet, and no payment is taken. When they launch, subscriptions will renew automatically until cancelled, credits bought in a pack won't expire, and our Refund Policy will apply.",
            ],
        },
        {
            id: "acceptable-use",
            title: "Acceptable use",
            paragraphs: ["You agree not to use Thumblify to:"],
            list: [
                "Create illegal, hateful, harassing, sexually explicit or violent content.",
                "Infringe anyone's copyright, trademark or likeness, for example by uploading reference images you have no right to use.",
                "Impersonate people or brands, or make deliberately misleading content.",
                "Get around safety filters, rate limits or credit limits, including by creating multiple accounts.",
                "Scrape, overload or attack the service, or access other people's accounts.",
            ],
        },
        {
            id: "your-content",
            title: "Your content",
            paragraphs: [
                "You keep the rights to the prompts and reference images you provide. You confirm you have the right to use any image you upload.",
                "You give us permission to store and process your content, including sending it to our AI provider, only to run the service. When you publish a thumbnail, you also let us show it in the community gallery until you unpublish or delete it.",
            ],
        },
        {
            id: "generated-thumbnails",
            title: "AI-generated thumbnails",
            paragraphs: [
                "You may use the thumbnails you generate for any lawful purpose, including on monetized videos and channels.",
                "AI output can be unexpected or similar to output created for other people, so we can't guarantee that a thumbnail is unique or free of third-party rights. In some countries AI-generated images may not be protected by copyright. You are responsible for how you use your thumbnails.",
            ],
        },
        {
            id: "community",
            title: "Community gallery",
            paragraphs: [
                "Published thumbnails are visible to anyone and can be liked and viewed by other users. We may remove content that breaks these terms. You can unpublish your thumbnails at any time.",
            ],
        },
        {
            id: "availability",
            title: "Service availability",
            paragraphs: [
                "We work to keep Thumblify running smoothly, but the service is provided \"as is\" and may sometimes be unavailable. We may change, pause or remove features at any time.",
            ],
        },
        {
            id: "termination",
            title: "Termination",
            paragraphs: [
                "You can delete your account at any time from Settings. We may suspend or close accounts that break these terms. When an account is closed, its remaining credits are lost.",
            ],
        },
        {
            id: "liability",
            title: "Limitation of liability",
            paragraphs: [
                "To the extent the law allows, Thumblify is not liable for indirect or consequential losses, or for losses caused by how you use generated content. Nothing in these terms limits rights you have under consumer protection law.",
            ],
        },
        {
            id: "changes",
            title: "Changes to these terms",
            paragraphs: [
                "We may update these terms. The date at the top shows the latest version. If you keep using Thumblify after a change, you accept the updated terms.",
            ],
        },
        {
            id: "contact",
            title: "Contact us",
            paragraphs: [`Questions about these terms? Email us at ${SUPPORT_EMAIL}.`],
        },
    ],
};

const refundPolicy: ILegalDocument = {
    id: "refund",
    title: "Refund Policy",
    path: "/refund-policy",
    summary: "When credits are returned automatically, and how refunds will work for paid plans.",
    updatedAt: UPDATED_AT,
    sections: [
        {
            id: "overview",
            title: "Overview",
            paragraphs: [
                `Thumblify runs on credits. Each thumbnail costs ${GENERATION_CREDIT_COST} credits, and we only want you to spend them on thumbnails you actually receive.`,
            ],
        },
        {
            id: "automatic-refunds",
            title: "Automatic credit refunds",
            paragraphs: ["You don't need to ask. Your credits are returned automatically when:"],
            list: [
                "The AI fails to generate a thumbnail or times out.",
                "The AI service is too busy to take the request.",
                "A safety filter blocks the prompt or the result.",
                "A generation is interrupted, for example by a server restart. These are refunded within about 10 minutes.",
            ],
        },
        {
            id: "not-refunded",
            title: "When credits are not refunded",
            paragraphs: ["Credits are not returned when:"],
            list: [
                "The thumbnail was generated successfully, even if it isn't what you hoped for. Try the free prompt improver for better results.",
                "You delete a thumbnail, or it is permanently removed from the recycle bin after 30 days.",
                `Your free balance is refilled. It is reset to ${FREE_MONTHLY_CREDITS} credits, not added to.`,
                "You delete your account, or it is closed for breaking our Terms & Conditions.",
            ],
        },
        {
            id: "free-plan",
            title: "Free plan",
            paragraphs: [
                "The Free plan costs nothing, so there is no money to refund. Free credits have no cash value.",
            ],
        },
        {
            id: "paid-plans",
            title: "Paid plans and credit packs",
            paragraphs: [
                "Pro, Ultra and credit packs are not on sale yet and you will not be charged. When they launch, these rules will apply:",
            ],
            list: [
                "You can cancel a plan anytime. Cancelling stops the next renewal and you keep your plan until the end of the period you paid for.",
                "Partly used billing periods are not refunded.",
                "Credits you have already used from a credit pack are not refunded.",
                "If you are charged by mistake, charged twice, or charged after cancelling, you will get a full refund.",
                "Any other request can be sent to us within 14 days of the charge, and we'll review it fairly.",
            ],
        },
        {
            id: "request-refund",
            title: "How to request a refund",
            paragraphs: [
                `Email ${SUPPORT_EMAIL} from the address on your account. Include the date of the charge or generation and what went wrong, and we'll reply by email.`,
            ],
        },
        {
            id: "changes",
            title: "Changes to this policy",
            paragraphs: [
                "We may update this policy, especially when paid plans launch. The date at the top shows the latest version.",
            ],
        },
    ],
};

export const legalDocuments: Record<LegalDocumentId, ILegalDocument> = {
    privacy: privacyPolicy,
    terms: termsAndConditions,
    refund: refundPolicy,
};
