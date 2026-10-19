import type { ButtonStyleOptions } from "../types";

const BASE =
  "inline-flex items-center justify-center gap-2 enabled:active:scale-[0.97] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-background-surface-2 disabled:cursor-not-allowed disabled:border disabled:border-border disabled:text-text-muted";

const SIZES = {
  xs: "min-h-7 px-3 py-1 text-xs font-medium",
  sm: "min-h-10 px-5 py-2 text-sm font-medium",
  md: "min-h-11 px-6 py-2.5 text-sm font-medium",
  lg: "min-h-12 px-6 py-3 text-[0.9375rem] font-medium",
  icon: "size-9 shrink-0",
  iconLg: "size-10 shrink-0",
  iconSm: "size-8 shrink-0",
};

const ROUNDED = {
  full: "rounded-full",
  lg: "rounded-lg",
};

const VARIANTS = {
  primary: "bg-primary hover:bg-primary-hover text-text-on-primary",
  secondary: "border border-border text-text-secondary hover:bg-background-surface-2 hover:text-text-primary",
  outline: "bg-transparent border border-border text-text-primary hover:border-text-muted",
  ghost: "bg-primary/10 text-primary hover:bg-primary/20",
  // Neutral solid: the page's text color as the fill, for a strong action that isn't the main CTA.
  inverse: "bg-text-primary text-background hover:bg-text-primary/85",
};

// Classes for Button, also used to style links (<Link>) that look like buttons.
export function buttonClasses({
  variant = "primary",
  size = "md",
  rounded = "full",
  fullWidth = true,
  className = "",
}: ButtonStyleOptions = {}) {
  const widthClass = fullWidth && !size.startsWith("icon") ? "w-full" : "";

  return [BASE, SIZES[size], ROUNDED[rounded], VARIANTS[variant], widthClass, className]
    .filter(Boolean)
    .join(" ");
}
