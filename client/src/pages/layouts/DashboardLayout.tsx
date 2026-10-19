import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";
import PageLoader from "../../components/PageLoader";

export default function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="relative flex min-h-dvh bg-background">
            {/* Mobile backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-backdrop backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <DashboardSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <main className="relative flex min-h-dvh min-w-0 flex-1 flex-col">
                <DashboardHeader setIsMobileOpen={setIsMobileOpen} />

                <div className="min-h-0 flex-1">
                    <Suspense fallback={<PageLoader />}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}
