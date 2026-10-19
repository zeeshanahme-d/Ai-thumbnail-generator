import React from "react";
import { buttonClasses } from "../lib/buttonClasses";
import type { ButtonStyleOptions } from "../types";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleOptions & {
    children: React.ReactNode;
  };

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  rounded,
  fullWidth,
  className,
  ...props
}) => (
  <button className={buttonClasses({ variant, size, rounded, fullWidth, className })} {...props}>
    {children}
  </button>
);

export default Button;
