import type { PageLoaderProps } from "../types";

export default function PageLoader({ fullScreen = false }: PageLoaderProps) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? "min-h-dvh bg-background-surface" : "py-32"}`}
    >
      <span className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}
