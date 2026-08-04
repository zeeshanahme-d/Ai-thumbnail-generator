import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../store/useSessionStore";
import { navlinks } from "../data/navlinks";
import MobileNav from "./MobileNav";
//icons
import Logo from "../assets/svgs/logo.svg?react";
import Button from "./Button";
import ThemeButton from "./ThemeButton";

export default function Navbar() {
  const isAuthenticated = useSession((state) => state.isAuthenticated);
  const user = useSession((state) => state.user);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavigateToProfile = () => {
    navigate("/profile")
  };

  return (
    <div className="sticky top-4 mt-4 mb-2 z-50 w-full max-w-7xl mx-auto px-6">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <nav className="px-4 flex items-center justify-between gap-4 rounded-2xl border border-border bg-background-card/70 py-2.5 shadow-[0_2px_16px_-6px_rgba(0,0,0,0.12)] backdrop-blur-xl">
          <Link to="/">
            <Logo className="h-7 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navlinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-lg px-3 py-1.5 text-[0.8rem] font-medium transition ${pathname === link.href
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
              <Button
                variant="secondary"
                size="icon"
                onClick={handleNavigateToProfile}
                className="hidden md:flex items-center"
              >
                <img src={user?.avatar?.url} alt="" className="h-full w-full rounded-full object-cover" />
              </Button>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-[0.8rem] font-medium text-text-on-primary transition-all hover:bg-primary-hover hover:scale-105 active:scale-95"
              >
                Get Started
                <ArrowRight size={15} />
              </Link>
            )}

            <MobileNav />
          </div>
        </nav>
      </motion.header>
    </div>
  );
}
