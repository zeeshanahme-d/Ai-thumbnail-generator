import { Moon, Sun } from "lucide-react";
import Button from "./Button";
import { useTheme } from "../store/useTheme";

interface ThemeButtonProps {
  showLabel?: boolean;
  className?: string;
}

export default function ThemeButton({ showLabel = false, className }: ThemeButtonProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="secondary"
      size={showLabel ? "xs" : "icon"}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={className}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      {showLabel && (isDark ? "Light Mode" : "Dark Mode")}
    </Button>
  );
}
