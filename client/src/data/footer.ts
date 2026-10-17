import type { IFooter } from "../types";

export const footerData: IFooter[] = [
    {
        title: "Product",
        links: [
            { name: "AI Generator", href: "/dashboard/generate" },
            { name: "Recreate", href: "/dashboard/recreate" },
            { name: "Community", href: "/community" },
            { name: "Pricing", href: "/pricing" },
        ],
    },
    {
        title: "Resources",
        links: [
            { name: "FAQ", href: "/#faq" },
            { name: "YouTube Preview", href: "/youtube-style-preview" },
            { name: "My Gallery", href: "/dashboard/gallery" },
            { name: "Settings", href: "/dashboard/settings" },
        ],
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "/privacy-policy" },
            { name: "Terms & Conditions", href: "/terms" },
            { name: "Refund Policy", href: "/refund-policy" },
        ],
    },
];
