import type { SettingsSectionProps } from "../../../../types";

// One block of the settings page: heading and optional description above a card.
export default function SettingsSection({ title, description, danger = false, children }: SettingsSectionProps) {
    return (
        <section>
            <h2 className="text-xl font-medium tracking-[-0.015em] text-text-primary">{title}</h2>
            {description && <p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p>}
            <div
                className={`mt-4 rounded-2xl border bg-background-card p-5 shadow-card sm:p-6 ${
                    danger ? "border-primary/30" : "border-border"
                }`}
            >
                {children}
            </div>
        </section>
    );
}
