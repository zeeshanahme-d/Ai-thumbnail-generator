import { Video } from "lucide-react";

export default function PreviewCard({ className = "" }: { className?: string }) {
    return (
        <div className={`w-48 rounded-2xl border border-border bg-background-card p-3 shadow-sm ${className}`}>
            <div className="flex h-24 items-center justify-center rounded-xl bg-background-surface-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Video size={18} className="text-primary/70" />
                </div>
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-2 w-3/4 rounded-full bg-background-surface-2" />
                <div className="h-2 w-1/2 rounded-full bg-background-surface-2" />
            </div>
        </div>
    );
}
