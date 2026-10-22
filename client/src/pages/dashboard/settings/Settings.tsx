import DashboardPage from "../../../components/DashboardPage";
import BillingSection from "./components/BillingSection";
import InvoicesSection from "./components/InvoicesSection";
import EditProfileSection from "./components/EditProfileSection";
import ChangePasswordSection from "./components/ChangePasswordSection";
import DangerZoneSection from "./components/DangerZoneSection";

export default function Settings() {
    return (
        <DashboardPage
            eyebrow="Settings"
            title="Your account"
            description="Your plan and credits, your public profile, your password and your account."
        >
            <div className="flex max-w-4xl flex-col gap-12">
                <BillingSection />
                <InvoicesSection />
                <EditProfileSection />
                <ChangePasswordSection />
                <DangerZoneSection />
            </div>
        </DashboardPage>
    );
}
