import { TrendingUp } from "lucide-react";

const BARS = [
    { height: "40%", color: "bg-background-surface-2" },
    { height: "55%", color: "bg-background-surface-2" },
    { height: "70%", color: "bg-background-surface-2" },
    { height: "85%", color: "bg-primary/40" },
    { height: "100%", color: "bg-primary" },
];

export default function CtrStatCard({ className = "" }: { className?: string }) {
    return (
        <div className={`w-56 rounded-2xl border border-border bg-background-card p-4 shadow-sm ${className}`}>
            <div className="flex items-center gap-1.5 text-text-muted">
                <TrendingUp size={13} />
                <span className="text-[10px] font-semibold tracking-widest">SCROLL CTR</span>
            </div>
            <div className="mt-2 flex items-end gap-2">
                <span className="text-2xl font-bold text-primary">+18.4%</span>
                <span className="mb-1 text-xs text-text-muted">Increase</span>
            </div>
            <div className="mt-4 flex h-10 items-end gap-1.5">
                {BARS.map((bar, index) => (
                    <div
                        key={index}
                        className={`flex-1 rounded-sm ${bar.color}`}
                        style={{ height: bar.height }}
                    />
                ))}
            </div>
        </div>
    );
}
