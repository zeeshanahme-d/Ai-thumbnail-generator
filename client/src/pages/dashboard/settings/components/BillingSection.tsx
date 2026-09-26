import { Sparkles } from "lucide-react";
import Button from "../../../../components/Button";
import { getRemainingCredits } from "../../../../lib/credits";
import { useSession } from "../../../../store/useSessionStore";

export default function BillingSection() {
    const user = useSession((state) => state.user);

    const planName = user?.plan
        ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) + " Plan"
        : "Free Plan";

    const isSubscribed = Boolean(user?.plan && user.plan !== "free");

    const statusText = user?.subscriptionStatus
        ? user.subscriptionStatus.charAt(0).toUpperCase() + user.subscriptionStatus.slice(1)
        : "Active";

    const totalCredits = user?.totalcredits ?? 0;
    const creditsUsed = user?.creditsUsed ?? 0;
    const remainingCredits = getRemainingCredits(user);
    const usagePercentage = totalCredits > 0 ? Math.min(100, Math.max(0, (creditsUsed / totalCredits) * 100)) : 0;

    // Unverified accounts have no refill date yet, so the line stays hidden for them.
    const formattedResetDate = user?.creditsResetAt
        ? new Date(user.creditsResetAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : null;

    return (
        <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                CURRENT MEMBERSHIP
            </h2>
            <div className="rounded-2xl border border-border bg-background-card p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <h3 className="text-xl font-bold text-text-primary">{planName}</h3>
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                {statusText}
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary">
                            {isSubscribed ? (
                                <>
                                    You are currently on the <span className="font-semibold text-primary">{planName}</span>. Upgrade or manage your subscription to adjust generation limits.
                                </>
                            ) : (
                                <>
                                    You are currently on the <span className="font-semibold text-primary">Free Plan</span>. Upgrade to unlock HD/Ultra qualities and unlimited presets.
                                </>
                            )}
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-fit! shrink-0"
                        disabled
                        title="Paid plans are coming soon."
                    >
                        {isSubscribed ? "Manage Plan" : "Upgrade +"}
                    </Button>
                </div>

                <div className="my-6 h-px w-full bg-border" />

                <div>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
                        <div className="flex items-center gap-2 font-medium text-text-secondary">
                            <Sparkles size={16} className="text-primary" />
                            Thumbnail Generations Limit
                        </div>
                        <span className="font-medium text-text-secondary">
                            <span className="text-text-primary font-semibold">{creditsUsed}</span> / {totalCredits} credits
                        </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-background-surface-2">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
                            style={{ width: `${usagePercentage}%` }}
                        />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-text-muted">
                        <span>{usagePercentage.toFixed(1)}% consumed this billing cycle ({remainingCredits} remaining)</span>
                        {formattedResetDate && <span>Resets on {formattedResetDate}</span>}
                    </div>
                </div>
            </div>
        </section>
    );
}
