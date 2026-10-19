import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import Logo from "../../../assets/svgs/logo.svg?react";
import Button from "../../../components/Button";
import ThemeButton from "../../../components/ThemeButton";

interface DashboardHeaderProps {
  setIsMobileOpen: (open: boolean) => void;
}

// The dashboard's top bar below lg, where the sidebar is a drawer.
export default function DashboardHeader({ setIsMobileOpen }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/75 px-4 backdrop-blur-md sm:px-6 lg:hidden">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Open menu"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={18} />
        </Button>
        <Link to="/" aria-label="Thumblify home">
          <Logo className="h-6 w-auto" />
        </Link>
      </div>
      <ThemeButton />
    </header>
  );
}
