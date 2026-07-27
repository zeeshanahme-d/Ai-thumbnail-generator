import { List } from "lucide-react";
import BillingSection from "./components/BillingSection";
import InvoicesSection from "./components/InvoicesSection";
import EditProfileSection from "./components/EditProfileSection";
import Wrapper from "../../../components/Wrapper";

export default function Settings() {
    return (
        <div className="px-6 py-10 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(230,57,70,0.08)_0%,transparent_60%)]">

            {/* Header Section */}
            <div>
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <List size={12} strokeWidth={2.5} />
                    BILLING & PREFERENCES
                </div>
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-text-primary">
                    Settings & Billing
                </h1>
                <p className="text-sm text-text-secondary">
                    Manage your ongoing subscriptions, monthly limits, personal account parameters, and invoice details.
                </p>
            </div>

            <div className="my-10 h-px w-full bg-border" />

            <Wrapper className="mx-0! px-0!">
                {/* Content Sections */}
                <div className="flex flex-col gap-8">
                    <BillingSection />
                    <InvoicesSection />
                    <EditProfileSection />
                </div>
            </Wrapper>
        </div>
    );
}
