import { List } from "lucide-react";
import BillingSection from "./components/BillingSection";
import InvoicesSection from "./components/InvoicesSection";
import EditProfileSection from "./components/EditProfileSection";
import ChangePasswordSection from "./components/ChangePasswordSection";
import DangerZoneSection from "./components/DangerZoneSection";

export default function Settings() {
    return (
        <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(230,57,70,0.08)_0%,transparent_60%)]">

            {/* Header Section */}
            <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    <List size={12} />
                    Billing & Preferences
                </span>
                <h1 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                    Settings & Billing
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                    Manage your ongoing subscriptions, monthly limits, personal account parameters, and invoice details.
                </p>
            </div>

            <hr className="my-8 border-border" />

            {/* Content Sections */}
            <div className="flex max-w-4xl flex-col gap-10">
                <BillingSection />
                <InvoicesSection />
                <EditProfileSection />
                <ChangePasswordSection />
                <DangerZoneSection />
            </div>
        </div>
    );
}
