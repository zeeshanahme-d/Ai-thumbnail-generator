import { Settings as SettingsIcon } from "lucide-react";
import DashboardPage from "../components/DashboardPage";
import { useSession } from "../../../store/useSessionStore";

export default function Settings() {
    const user = useSession((state) => state.user);

    const rows = [
        { label: "Full name", value: user?.fullName ?? "—" },
        { label: "Email", value: user?.email ?? "—" },
        { label: "Plan", value: user?.plan ?? "free" },
        { label: "Credits", value: String(user?.credits ?? 0) },
    ];

    return (
        <DashboardPage
            icon={SettingsIcon}
            title="Settings"
            description="Billing and profile options."
        >
            <div className="overflow-hidden rounded-2xl border border-border bg-background-card">
                {rows.map((row, index) => (
                    <div
                        key={row.label}
                        className={`flex items-center justify-between px-5 py-4 ${index > 0 ? "border-t border-border" : ""
                            }`}
                    >
                        <span className="text-sm text-text-secondary">{row.label}</span>
                        <span className="text-sm font-medium capitalize text-text-primary">
                            {row.value}
                        </span>
                    </div>
                ))}
            </div>
        </DashboardPage>
    );
}
