import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "icon" | "iconSm" | "iconLg";
  rounded?: "full" | "lg";
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  rounded = "full",
  fullWidth = true,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 enabled:active:scale-[0.97] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-background-surface-2 disabled:cursor-not-allowed disabled:border disabled:border-border disabled:text-text-muted";

  const sizeClasses = {
    xs: "min-h-7 px-3 py-1 text-xs font-medium",
    sm: "min-h-10 px-5 py-2 text-sm font-medium",
    md: "min-h-11 px-6 py-2.5 text-sm font-medium",
    icon: "size-9 shrink-0",
    iconLg: "size-10 shrink-0",
    iconSm: "size-8 shrink-0",
  };

  const roundedClasses = {
    full: "rounded-full",
    lg: "rounded-lg",
  };

  const variantClasses = {
    primary: "bg-primary hover:bg-primary-hover text-text-on-primary",
    secondary: "border border-border text-text-secondary hover:bg-background-surface-2 hover:text-text-primary",
    outline: "bg-transparent border border-border text-text-primary hover:border-text-muted",
    ghost: "bg-primary/10 text-primary hover:bg-primary/20",
  };

  const widthClass = fullWidth && !size.startsWith("icon") ? "w-full" : "";

  const combinedClasses = `
        ${baseClasses}
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${variantClasses[variant]}
        ${widthClass}
        ${className}
    `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
