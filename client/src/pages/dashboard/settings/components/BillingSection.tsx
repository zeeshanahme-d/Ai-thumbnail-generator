import { Sparkles } from "lucide-react";
import Button from "../../../../components/Button";

export default function BillingSection() {
    return (
        <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                CURRENT MEMBERSHIP
            </h2>
            <div className="rounded-2xl border border-border bg-background-card p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-text-primary">Free Plan</h3>
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                Active
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary">
                            You are currently on the <span className="font-semibold text-primary">Free Plan</span>. Upgrade to unlock HD/Ultra qualities and unlimited presets.
                        </p>
                    </div>
                    <Button variant="primary" size="sm" className="w-fit!">
                        Upgrade +
                    </Button>
                </div>

                <div className="my-6 h-px w-full bg-border" />

                <div>
                    <div className="mb-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 font-medium text-text-secondary">
                            <Sparkles size={16} className="text-primary" />
                            Thumbnail Generations Limit
                        </div>
                        <span className="font-medium text-text-secondary">
                            <span className="text-text-primary font-semibold">3</span> / 5 used
                        </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-background-surface-2">
                        <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: "60%" }}
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
                        <span>60.0% consumed this billing cycle</span>
                        <span>Resets on Aug 1, 2026</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
