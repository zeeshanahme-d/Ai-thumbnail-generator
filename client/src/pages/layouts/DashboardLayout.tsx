import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";

export default function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex min-h-dvh bg-background-surface relative">
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <DashboardSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <main className="min-w-0 flex-1 flex flex-col min-h-dvh relative">
                <DashboardHeader setIsMobileOpen={setIsMobileOpen} />

                <div className="flex-1 min-h-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
