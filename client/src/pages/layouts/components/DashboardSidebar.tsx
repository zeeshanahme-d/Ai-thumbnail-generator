import { Link, NavLink } from "react-router-dom";
import {
  ChevronLeft,
  LayoutGrid,
  LogOut,
  X,
  Settings as SettingsIcon,
} from "lucide-react";
import Logo from "../../../assets/svgs/logo.svg?react";
import { dashboardNav } from "../../../data/dashboardNav";
import { useSession } from "../../../store/useSessionStore";
import { useLogout } from "../../auth/core/hooks";
import Button from "../../../components/Button";
import ThemeButton from "../../../components/ThemeButton";

interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: DashboardSidebarProps) {
  const user = useSession((state) => state.user);
  const { mutate: logout } = useLogout();
  const initial = (user?.fullName ?? "U").charAt(0).toUpperCase();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-dvh shrink-0 flex-col border-r border-border bg-background-card transition-all duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-18" : "w-68"}`}
    >
      <div
        className={`flex px-4 py-5 ${isCollapsed ? "justify-center" : "justify-between items-center gap-2"}`}
      >
        {!isCollapsed && (
          <Link to="/">
            <Logo className="h-7 w-auto" />
          </Link>
        )}
        {/* Desktop collapse button */}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="lg:flex! hidden! rounded-lg"
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""
              }`}
          />
        </Button>
        {/* Mobile close button */}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={() => setIsMobileOpen(false)}
          className="flex lg:hidden rounded-lg"
        >
          <X size={18} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 text-xs font-medium tracking-wide text-text-secondary">
            <LayoutGrid size={14} className="shrink-0" />
            <span>DASHBOARD</span>
          </div>
        ) : (
          <></>
        )}

        {dashboardNav.map((section) => (
          <div key={section.label}>
            {!isCollapsed && (
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-text-muted">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map(({ to, icon: Icon, label, description }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? label : undefined}
                  className={({ isActive }) =>
                    `relative rounded-lg px-2.5 py-2.5 flex items-center gap-3 transition ${isActive
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
        <Link to="/profile" className="w-fit! flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white">
            {initial}
          </span>
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm max-w-35 font-medium text-text-primary">
                  {user?.fullName ?? "Guest"}
                </p>
                <p className="truncate text-xs max-w-37.5 text-text-muted">
                  {user?.email ?? ""}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium capitalize text-primary -ml-2">
                {user?.plan ?? "free"}
              </span>
            </>
          )}
        </Link>

        <div className={`mt-4 flex gap-2 ${isCollapsed ? "flex-col px-0.5" : ""}`}>
          <ThemeButton showLabel={!isCollapsed} className="rounded-lg" />
          <Link to="/dashboard/settings" aria-label="Settings">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="rounded-lg"
            >
              <SettingsIcon size={15} />
            </Button>
          </Link>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => logout()}
            aria-label="Log out"
            className="rounded-lg hover:text-primary!"
          >
            <LogOut size={15} />
          </Button>
        </div>
      </div>
    </aside>
  );
}
