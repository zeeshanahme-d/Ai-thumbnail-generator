import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface DashboardPageProps {
    icon: LucideIcon;
    title: string;
    description: string;
    children?: ReactNode;
}

// Shared shell for dashboard screens: title block + content slot.
export default function DashboardPage({
    icon: Icon,
    title,
    description,
    children,
}: DashboardPageProps) {
    return (
        <div className="px-6 py-10 md:px-10">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={20} />
                    </span>
                    <div>
                        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
                        <p className="text-sm text-text-secondary">{description}</p>
                    </div>
                </div>

                <div className="mt-8">
                    {children ?? (
                        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-background-card">
                            <p className="text-sm text-text-muted">Coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
