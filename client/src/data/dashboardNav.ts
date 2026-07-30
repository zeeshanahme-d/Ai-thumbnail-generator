import { ImagePlus, RefreshCw, Settings, Trash2, User, Users } from "lucide-react";
import type { IDashboardNavSection } from "../types";

export const dashboardNav: IDashboardNavSection[] = [
    {
        label: "Create",
        items: [
            {
                to: "/dashboard/generate",
                icon: ImagePlus,
                label: "Generate",
                description: "Create a new thumbnail",
            },
            {
                to: "/dashboard/recreate",
                icon: RefreshCw,
                label: "Recreate",
                description: "Generate from a reference image",
            },
        ],
    },
    {
        label: "Discover",
        items: [
            {
                to: "/dashboard/community",
                icon: Users,
                label: "Community",
                description: "Browse community thumbnails",
            },
            {
                to: "/dashboard/gallery",
                icon: User,
                label: "My Gallery",
                description: "Your generated thumbnails",
            },
        ],
    },
    {
        label: "Account",
        items: [
            {
                to: "/dashboard/settings",
                icon: Settings,
                label: "Settings",
                description: "Profile & billing",
            },
            {
                to: "/dashboard/recycle-bin",
                icon: Trash2,
                label: "Recycle Bin",
                description: "Restore deleted thumbnails",
            },
        ],
    },
];
