import Eyebrow from "./Eyebrow";
import type { DashboardPageProps } from "../types";

// Shell for every dashboard page: a header (mono label, heading, description, actions) over the content.
export default function DashboardPage({ eyebrow, title, description, actions, children }: DashboardPageProps) {
    return (
        <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
            <div className="mx-auto w-full max-w-7xl">
                <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b border-border pb-8">
                    <div className="max-w-2xl">
                        <Eyebrow>{eyebrow}</Eyebrow>
                        <h1 className="mt-3 text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] font-medium leading-tight tracking-[-0.03em] text-text-primary">
                            {title}
                        </h1>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">{description}</p>
                    </div>
                    {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
                </header>

                <div className="mt-8">
                    {children ?? (
                        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border-strong bg-background-card">
                            <p className="text-sm text-text-muted">Coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
