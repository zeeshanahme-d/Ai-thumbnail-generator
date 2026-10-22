import type { EyebrowProps } from "../types";

// Small mono label above a heading or inside a card: "PRICING", "EXAMPLE", "STEP 02".
export default function Eyebrow({ children, dot = false, className = "" }: EyebrowProps) {
    return (
        <span
            className={`inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.06em] text-text-muted ${className}`}
        >
            {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />}
            {children}
        </span>
    );
}
