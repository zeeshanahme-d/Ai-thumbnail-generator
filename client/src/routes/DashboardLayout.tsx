import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
    ChevronLeft,
    LayoutGrid,
    LogOut,
    Moon,
    Settings as SettingsIcon,
} from "lucide-react";
import Logo from "../assets/svgs/logo.svg?react";
import { dashboardNav } from "../data/dashboardNav";
import { useSession } from "../store/useSessionStore";
import { useLogout } from "../pages/auth/core/hooks";

export default function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const user = useSession((state) => state.user);
    const { mutate: logout } = useLogout();

    const initial = (user?.fullName ?? "U").charAt(0).toUpperCase();

    return (
        <div className="flex min-h-dvh bg-background-surface">
            <aside
                className={`sticky top-0 flex h-dvh shrink-0 flex-col border-r border-border bg-background-card transition-[width] duration-300 ${isCollapsed ? "w-20" : "w-[272px]"
                    }`}
            >
                {/* Brand */}
                <div className="flex items-center justify-between gap-2 px-5 py-5">
                    {!isCollapsed && (
                        <Link to="/">
                            <Logo className="h-7 w-auto" />
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsCollapsed((prev) => !prev)}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:bg-background-surface-2 hover:text-text-primary"
                    >
                        <ChevronLeft
                            size={15}
                            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 pb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium tracking-wide text-text-secondary">
                        <LayoutGrid size={14} className="shrink-0" />
                        {!isCollapsed && <span>DASHBOARD</span>}
                    </div>

                    {dashboardNav.map((section) => (
                        <div key={section.label} className="mt-4">
                            {!isCollapsed && (
                                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                                    {section.label}
                                </p>
                            )}
                            <div className="flex flex-col gap-1">
                                {section.items.map(({ to, icon: Icon, label, description }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        title={isCollapsed ? label : undefined}
                                        className={({ isActive }) =>
                                            `relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${isActive
                                                ? "bg-primary/8 text-primary"
                                                : "text-text-secondary hover:bg-background-surface-2 hover:text-text-primary"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <span className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
                                                )}
                                                <Icon size={18} className="shrink-0" />
                                                {!isCollapsed && (
                                                    <span className="min-w-0">
                                                        <span className="block truncate text-sm font-medium">
                                                            {label}
                                                        </span>
                                                        <span className="block truncate text-xs text-text-muted">
                                                            {description}
                                                        </span>
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Account */}
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white">
                            {initial}
                        </span>
                        {!isCollapsed && (
                            <>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-text-primary">
                                        {user?.fullName ?? "Guest"}
                                    </p>
                                    <p className="truncate text-xs text-text-muted">
                                        {user?.email ?? ""}
                                    </p>
                                </div>
                                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium capitalize text-primary">
                                    {user?.plan ?? "free"}
                                </span>
                            </>
                        )}
                    </div>

                    <div className={`mt-4 flex gap-2 ${isCollapsed ? "flex-col" : ""}`}>
                        <button
                            type="button"
                            onClick={() => document.documentElement.classList.toggle("dark")}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-medium text-text-secondary transition hover:bg-background-surface-2 hover:text-text-primary"
                        >
                            <Moon size={14} />
                            {!isCollapsed && "Dark Mode"}
                        </button>
                        <Link
                            to="/dashboard/settings"
                            aria-label="Settings"
                            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:bg-background-surface-2 hover:text-text-primary"
                        >
                            <SettingsIcon size={15} />
                        </Link>
                        <button
                            type="button"
                            onClick={() => logout()}
                            aria-label="Log out"
                            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:bg-background-surface-2 hover:text-primary"
                        >
                            <LogOut size={15} />
                        </button>
                    </div>
                </div>
            </aside>

            <main className="min-w-0 flex-1">
                <Outlet />
            </main>
        </div>
    );
}
