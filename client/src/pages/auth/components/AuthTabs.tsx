import { Link, useLocation } from "react-router-dom";

const TABS = [
  { label: "Sign In", to: "/login" },
  { label: "Register", to: "/signup" },
];

export default function AuthTabs() {
  const { pathname } = useLocation();

  return (
    <div className="flex gap-1 rounded-xl bg-background-surface-2 p-1">
      {TABS.map((tab) => {
        const isActive = pathname === tab.to;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition ${
              isActive
                ? "bg-background-card text-primary shadow-sm"
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
