import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import Logo from "../../../assets/svgs/logo.svg?react";
import Button from "../../../components/Button";
import ThemeButton from "../../../components/ThemeButton";

interface DashboardHeaderProps {
  setIsMobileOpen: (open: boolean) => void;
}

export default function DashboardHeader({ setIsMobileOpen }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background-surface px-4 py-3 lg:hidden">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="rounded-lg"
        >
          <Menu size={18} />
        </Button>
        <Link to="/">
          <Logo className="h-6 w-auto" />
        </Link>
      </div>
      <ThemeButton />
    </header>
  );
}
