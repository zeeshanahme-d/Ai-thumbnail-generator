import { createContext } from "react";

// True inside a Tooltip, so an icon Button in it doesn't add a second one.
export const InsideTooltip = createContext(false);
