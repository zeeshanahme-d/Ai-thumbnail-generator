import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "icon";
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
    "inline-flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer text-box-trim disabled:bg-background-surface-2 disabled:cursor-not-allowed disabled:border disabled:border-border disabled:text-text-muted";

  const sizeClasses = {
    xs: "px-3 py-1 text-[11px] font-semibold",
    sm: "px-5 py-2.5 text-sm font-medium",
    md: "px-6 py-3.25 text-sm font-medium",
    icon: "size-9 shrink-0",
  };

  const roundedClasses = {
    full: "rounded-full",
    lg: "rounded-lg",
  };

  const variantClasses = {
    primary: "bg-primary hover:bg-primary-hover text-text-on-primary",
    secondary:
      "border border-border text-text-primary hover:bg-background-surface-2",
    outline: "bg-transparent border border-white/20 hover:bg-white/10",
    ghost: "bg-primary/10 text-primary hover:bg-primary/20",
  };

  const widthClass = fullWidth && size !== "icon" ? "w-full" : "";

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
