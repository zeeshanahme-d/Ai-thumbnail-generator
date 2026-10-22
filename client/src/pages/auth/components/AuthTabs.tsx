import { Link, useLocation } from "react-router-dom";

const TABS = [
  { label: "Sign in", to: "/login" },
  { label: "Register", to: "/signup" },
];

export default function AuthTabs() {
  const { pathname } = useLocation();

  return (
    <div className="flex gap-1 rounded-xl border border-border bg-background-surface p-1">
      {TABS.map((tab) => {
        const isActive = pathname === tab.to;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            aria-current={isActive ? "page" : undefined}
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
              isActive
                ? "bg-background-card text-text-primary shadow-card"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
