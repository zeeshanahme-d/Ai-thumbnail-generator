import { ImagePlus, RefreshCw, Settings, User, Users } from "lucide-react";
import type { IDashboardNavSection } from "../types";

export const dashboardNav: IDashboardNavSection[] = [
    {
        label: "Tools",
        items: [
            {
                to: "/dashboard/generate",
                icon: ImagePlus,
                label: "Generate",
                description: "Create from prompt",
            },
            {
                to: "/dashboard/recreate",
                icon: RefreshCw,
                label: "Recreate",
                description: "Modify existing image",
            },
        ],
    },
    {
        label: "Explore",
        items: [
            {
                to: "/dashboard/community",
                icon: Users,
                label: "Community",
                description: "Browse creations",
            },
            {
                to: "/dashboard/profile",
                icon: User,
                label: "Profile",
                description: "Your gallery",
            },
        ],
    },
    {
        label: "Preferences",
        items: [
            {
                to: "/dashboard/settings",
                icon: Settings,
                label: "Settings",
                description: "Billing & profile options",
            },
        ],
    },
];
