import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../store/useSessionStore";
import { navlinks } from "../data/navlinks";
import MobileNav from "./MobileNav";
import ProfileMenu from "./ProfileMenu";
//icons
import Logo from "../assets/svgs/logo.svg?react";
import ThemeButton from "./ThemeButton";

export default function Navbar() {
  const isAuthenticated = useSession((state) => state.isAuthenticated);
  const { pathname } = useLocation();

  return (
    <div className="sticky top-4 z-50 mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <header
      >
        <nav className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background-card/70 py-2 pl-4 pr-2 sm:pl-5 shadow-[0_2px_16px_-6px_rgba(0,0,0,0.12)] backdrop-blur-xl">
          <Link to="/">
            <Logo className="h-7 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navlinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-lg px-2.5 py-2 text-sm font-medium whitespace-nowrap transition lg:px-3 ${pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-background-surface-2 hover:text-text-primary"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeButton showLabel={false} />

            {isAuthenticated ? (
              <ProfileMenu />
            ) : (
              <Link
                to="/login"
                className="hidden md:flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-5 text-sm font-medium text-text-on-primary transition-all hover:bg-primary-hover active:scale-[0.97]"
              >
                Get Started
                <ArrowRight size={15} />
              </Link>
            )}

            <MobileNav />
          </div>
        </nav>
      </header>
    </div>
  );
}
