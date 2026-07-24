import { RefreshCw } from "lucide-react";
import DashboardPage from "../components/DashboardPage";

export default function Recreate() {
    return (
        <DashboardPage
            icon={RefreshCw}
            title="Recreate"
            description="Upload an existing thumbnail and let the AI remix it."
        />
    );
}
