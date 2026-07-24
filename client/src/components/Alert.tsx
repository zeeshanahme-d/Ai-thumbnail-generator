import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AlertProps, AlertVariant } from "../types";

const VARIANTS: Record<AlertVariant, { icon: LucideIcon; className: string }> = {
    error: {
        icon: CircleAlert,
        className: "bg-primary/8 border-primary/20 text-primary",
    },
    success: {
        icon: CircleCheck,
        className: "bg-success/10 border-success/25 text-success",
    },
    warning: {
        icon: TriangleAlert,
        className: "bg-warning/10 border-warning/25 text-warning",
    },
    info: {
        icon: Info,
        className:
            "bg-background-surface-2 border-border text-text-secondary",
    },
};

export default function Alert({
    variant = "error",
    children,
    className = "",
}: AlertProps) {
    const { icon: Icon, className: variantClassName } = VARIANTS[variant];

    return (
        <div
            role="alert"
            className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${variantClassName} ${className}`}
        >
            <Icon size={16} className="mt-0.5 shrink-0" />
            <span>{children}</span>
        </div>
    );
}
