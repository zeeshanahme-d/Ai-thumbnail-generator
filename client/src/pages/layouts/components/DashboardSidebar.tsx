import { Link, NavLink } from "react-router-dom";
import { ChevronLeft, LogOut, X, Settings as SettingsIcon } from "lucide-react";
import Logo from "../../../assets/svgs/logo.svg?react";
import { dashboardNav } from "../../../data/dashboardNav";
import { useSession } from "../../../store/useSessionStore";
import { getRemainingCredits } from "../../../lib/credits";
import { buttonClasses } from "../../../lib/buttonClasses";
import { getUserInitial } from "../../../lib/herlper-fuctions";
import { useLogout } from "../../../core/auth/hooks";
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
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

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-dvh shrink-0 flex-col border-r border-border bg-background-surface transition-all duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-18" : "w-68"}`}
    >
      <div className={`flex h-16 items-center px-4 ${isCollapsed ? "justify-center" : "justify-between gap-2"}`}>
        {!isCollapsed && (
          <Link to="/" aria-label="Thumblify home">
            <Logo className="h-7 w-auto" />
          </Link>
        )}
        {/* Desktop collapse button */}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          rounded="lg"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden! lg:flex!"
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </Button>
        {/* Mobile close button */}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          rounded="lg"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
          className="flex lg:hidden"
        >
          <X size={18} />
        </Button>
      </div>

      {/* Navigation */}
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
        {dashboardNav.map((section) => (
          <div key={section.label} className="mb-6 last:mb-0">
            {!isCollapsed && <Eyebrow className="px-3 pb-2">{section.label}</Eyebrow>}
            <div className="flex flex-col gap-1">
              {section.items.map(({ to, icon: Icon, label, description }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? label : undefined}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors ${isActive
                      ? "bg-background-surface-2 text-text-primary"
                      : "text-text-secondary hover:bg-background-surface-2 hover:text-text-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* The current page's marker: a short brand-red bar on the left edge. */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
                      )}
                      <Icon size={18} className="shrink-0" />
                      {!isCollapsed && (
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{label}</span>
                          <span className="block truncate text-xs text-text-muted">{description}</span>
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
        {!isCollapsed && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-background-card px-3 py-2.5">
            <Eyebrow>Credits left</Eyebrow>
            <span className="font-mono text-sm tabular-nums text-text-primary">{getRemainingCredits(user)}</span>
          </div>
        )}

        <Link to="/profile" className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-surface-2 text-sm font-medium text-text-primary">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt="" className="size-full object-cover" />
            ) : (
              getUserInitial(user?.fullName)
            )}
          </span>
          {!isCollapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-text-primary">{user?.fullName ?? "Guest"}</span>
                <span className="block truncate text-xs text-text-muted">{user?.email ?? ""}</span>
              </span>
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-text-secondary">
                {user?.plan ?? "free"}
              </span>
            </>
          )}
        </Link>

        <div className={`mt-4 flex gap-2 ${isCollapsed ? "flex-col items-center" : ""}`}>
          <ThemeButton showLabel={!isCollapsed} className="rounded-lg" />
          <Link
            to="/dashboard/settings"
            aria-label="Settings"
            className={buttonClasses({ variant: "secondary", size: "icon", rounded: "lg" })}
          >
            <SettingsIcon size={15} />
          </Link>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            rounded="lg"
            onClick={() => logout()}
            aria-label="Log out"
          >
            <LogOut size={15} />
          </Button>
        </div>
      </div>
    </aside>
  );
}
