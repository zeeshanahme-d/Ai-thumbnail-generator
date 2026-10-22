import SettingsSection from "./SettingsSection";

export default function InvoicesSection() {
    return (
        <SettingsSection title="Invoices">
            <p className="text-sm leading-relaxed text-text-secondary">
                Paddle, our payment provider, emails you a receipt for every payment. Subscribers can also
                download their invoices from Manage plan.
            </p>
        </SettingsSection>
    );
}
