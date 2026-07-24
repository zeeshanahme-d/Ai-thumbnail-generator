import type { IFooter } from "../types";

export const footerData: IFooter[] = [
    {
        title: "Product",
        links: [
            { name: "AI Generator", href: "/generate" },
            { name: "Recreate", href: "/generate" },
            { name: "Community", href: "/community" },
            { name: "Pricing", href: "#pricing" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "About", href: "#about" },
            { name: "Blog", href: "#blog" },
            { name: "Careers", href: "#careers" },
        ],
    },
    {
        title: "Support",
        links: [
            { name: "Docs", href: "#docs" },
            { name: "FAQ", href: "#faq" },
            { name: "Contact", href: "#contact" },
        ],
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "#privacy" },
            { name: "Terms of Service", href: "#terms" },
            { name: "Refund Policy", href: "#refund" },
        ],
    },
];
