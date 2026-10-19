import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../../../components/Button";
import Eyebrow from "../../../../components/Eyebrow";
import SettingsSection from "./SettingsSection";
import { buttonClasses } from "../../../../lib/buttonClasses";
import { getAllowanceLeft } from "../../../../lib/credits";
import { hasLiveSubscription } from "../../../../lib/paddle";
import { useBillingPortal } from "../../../../core/billing/hooks/use-billing-portal";
import { useSession } from "../../../../store/useSessionStore";

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function BillingSection() {
    const user = useSession((state) => state.user);
    const { openPortal, isPending } = useBillingPortal();

    const planName = user?.plan
        ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) + " plan"
        : "Free plan";

    const isSubscribed = Boolean(user?.plan && user.plan !== "free") && hasLiveSubscription(user);
    const isPastDue = user?.subscriptionStatus === "past_due";

    const statusText = isPastDue ? "Payment failed" : "Active";

    // No renewal date on a live plan means its cancellation is scheduled.
    const renewalText = !isSubscribed
        ? null
        : user?.subscriptionRenewsAt
            ? `Renews on ${formatDate(user.subscriptionRenewsAt)}.`
            : user?.subscriptionPeriodEnd
                ? `Ends on ${formatDate(user.subscriptionPeriodEnd)}, then you move to the Free plan.`
                : null;

    const totalCredits = user?.totalcredits ?? 0;
    const creditsUsed = user?.creditsUsed ?? 0;
    const allowanceLeft = getAllowanceLeft(user);
    const packCredits = user?.packCredits ?? 0;
    const usagePercentage = totalCredits > 0 ? Math.min(100, Math.max(0, (creditsUsed / totalCredits) * 100)) : 0;

    // Unverified accounts have no refill date yet, so the line stays hidden for them.
    const formattedResetDate = user?.creditsResetAt ? formatDate(user.creditsResetAt) : null;

    return (
        <SettingsSection title="Plan and credits">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-lg font-medium tracking-[-0.015em] text-text-primary">{planName}</h3>
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] ${
                                isPastDue ? "border-warning/30 text-warning" : "border-success/30 text-success"
                            }`}
                        >
                            <span aria-hidden="true" className={`size-1.5 rounded-full ${isPastDue ? "bg-warning" : "bg-success"}`} />
                            {statusText}
                        </span>
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
                        {isPastDue ? (
                            <>
                                Your last payment didn't go through. Update your payment method in{" "}
                                <span className="font-medium text-text-primary">Manage plan</span> to keep your plan.
                            </>
                        ) : isSubscribed ? (
                            <>
                                You're on the <span className="font-medium text-text-primary">{planName}</span>.{" "}
                                {renewalText} Cancel, change your card or download invoices in Manage plan.
                            </>
                        ) : (
                            <>
                                You're on the <span className="font-medium text-text-primary">Free plan</span>. Upgrade
                                to Pro or Ultra for more credits every month.
                            </>
                        )}
                    </p>
                </div>

                {isSubscribed ? (
                    <Button
                        type="button"
                        variant={isPastDue ? "primary" : "secondary"}
                        size="sm"
                        rounded="lg"
                        fullWidth={false}
                        className="shrink-0 self-start"
                        disabled={isPending}
                        onClick={openPortal}
                    >
                        {isPending && <Loader2 size={16} className="animate-spin" />}
                        Manage plan
                    </Button>
                ) : (
                    <Link
                        to="/pricing"
                        className={buttonClasses({ size: "sm", rounded: "lg", fullWidth: false, className: "shrink-0 self-start" })}
                    >
                        Upgrade
                    </Link>
                )}
            </div>

            <div className="mt-6 border-t border-border pt-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <Eyebrow>Monthly credits</Eyebrow>
                    <span className="font-mono text-sm tabular-nums text-text-secondary">
                        <span className="text-text-primary">{creditsUsed}</span> / {totalCredits} used
                    </span>
                </div>

                <div
                    role="progressbar"
                    aria-label="Monthly credits used"
                    aria-valuenow={Math.round(usagePercentage)}
                    className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background-surface-2"
                >
                    <div
                        className="h-full rounded-full bg-text-primary transition-[width] duration-300"
                        style={{ width: `${usagePercentage}%` }}
                    />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-text-muted">
                    <span className="tabular-nums">{allowanceLeft} left this cycle</span>
                    {formattedResetDate && <span>Refills on {formattedResetDate}</span>}
                </div>

                {packCredits > 0 && (
                    <p className="mt-4 text-sm text-text-secondary">
                        <span className="font-mono tabular-nums text-text-primary">
                            +{packCredits.toLocaleString("en-US")}
                        </span>{" "}
                        purchased credits. They never expire and are used after your monthly credits.
                    </p>
                )}
            </div>
        </SettingsSection>
    );
}
