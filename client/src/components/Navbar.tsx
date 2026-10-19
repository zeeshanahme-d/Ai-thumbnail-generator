import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../store/useSessionStore";
import { navlinks } from "../data/navlinks";
import { buttonClasses } from "../lib/buttonClasses";
import MobileNav from "./MobileNav";
import ProfileMenu from "./ProfileMenu";
//icons
import Logo from "../assets/svgs/logo.svg?react";
import ThemeButton from "./ThemeButton";

// The homepage bar turns solid once the page has scrolled past this many pixels.
const SCROLLED_OFFSET = 24;

// True once the window has scrolled past `offset`. Listens only while `enabled`.
function useScrolledPast(offset: number, enabled: boolean) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const update = () => setScrolled(window.scrollY > offset);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [offset, enabled]);

  return enabled && scrolled;
}

export default function Navbar() {
  const isAuthenticated = useSession((state) => state.isAuthenticated);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isScrolled = useScrolledPast(SCROLLED_OFFSET, isHome);

  const items = (
    <>
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
              ? isHome
                ? "text-text-primary"
                : "bg-primary/10 text-primary"
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
        ) : isHome ? (
          <Link
            to="/login"
            className={buttonClasses({ variant: "inverse", size: "sm", fullWidth: false, className: "max-md:hidden min-h-9 shrink-0 whitespace-nowrap px-4" })}
          >
            Get Started
          </Link>
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
    </>
  );

  // Homepage: a full-width bar, transparent over the hero, that becomes a blurred surface on scroll.
  if (isHome) {
    return (
      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-200 ease-out-expo ${isScrolled
          ? "border-border bg-background/75 backdrop-blur-md"
          : "border-transparent bg-transparent"
          }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {items}
        </nav>
      </header>
    );
  }

  return (
    <div className="sticky top-4 z-50 mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <header
      >
        <nav className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background-card/70 py-2 pl-4 pr-2 sm:pl-5 shadow-[0_2px_16px_-6px_rgba(0,0,0,0.12)] backdrop-blur-xl">
          {items}
        </nav>
      </header>
    </div>
  );
}
