import type { YtPreviewTheme } from "../../types";

// YouTube's own palette, independent of the app theme.
export const ytTheme: Record<
  YtPreviewTheme,
  { page: string; title: string; meta: string; surface: string; border: string }
> = {
  light: {
    page: "bg-white",
    title: "text-neutral-900",
    meta: "text-neutral-600",
    surface: "bg-neutral-100",
    border: "border-neutral-300",
  },
  dark: {
    page: "bg-neutral-950",
    title: "text-neutral-50",
    meta: "text-neutral-400",
    surface: "bg-neutral-800",
    border: "border-neutral-700",
  },
};
