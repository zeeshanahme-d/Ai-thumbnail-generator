import React, { useContext } from "react";
import { buttonClasses } from "../lib/buttonClasses";
import Tooltip from "./Tooltip";
import { InsideTooltip } from "../lib/tooltipContext";
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
}) => {
  const insideTooltip = useContext(InsideTooltip);
  const button = (
    <button className={buttonClasses({ variant, size, rounded, fullWidth, className })} {...props}>
      {children}
    </button>
  );

  // Icon-only buttons show their aria-label as a tooltip.
  const tooltip = size?.startsWith("icon") && !insideTooltip ? props["aria-label"] : undefined;
  return tooltip ? <Tooltip label={tooltip}>{button}</Tooltip> : button;
};

export default Button;
