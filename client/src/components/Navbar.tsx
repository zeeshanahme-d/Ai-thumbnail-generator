import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../store/useSessionStore";
import { navlinks } from "../data/navlinks";
import { buttonClasses } from "../lib/buttonClasses";
import MobileNav from "./MobileNav";
import ProfileMenu from "./ProfileMenu";
//icons
import Logo from "../assets/svgs/logo.svg?react";
import ThemeButton from "./ThemeButton";

// The bar turns solid once the page has scrolled past this many pixels.
const SCROLLED_OFFSET = 24;

// True once the window has scrolled past `offset`.
function useScrolledPast(offset: number) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > offset);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [offset]);

  return scrolled;
}

// The public pages' navbar: a full-width bar, transparent at the top of the page,
// that becomes a blurred surface with a hairline once the page scrolls.
export default function Navbar() {
  const isAuthenticated = useSession((state) => state.isAuthenticated);
  const { pathname } = useLocation();
  const isScrolled = useScrolledPast(SCROLLED_OFFSET);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-200 ease-out-expo ${isScrolled
        ? "border-border bg-background/75 backdrop-blur-md"
        : "border-transparent bg-transparent"
        }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/">
          <Logo className="h-7 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navlinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`rounded-lg px-2.5 py-2 text-sm font-medium whitespace-nowrap transition lg:px-3 ${pathname === link.href
                ? "text-text-primary"
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
              className={buttonClasses({ variant: "inverse", size: "sm", fullWidth: false, className: "max-md:hidden min-h-9 shrink-0 whitespace-nowrap px-4" })}
            >
              Get Started
            </Link>
          )}

          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
