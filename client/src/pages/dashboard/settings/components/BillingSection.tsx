import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Alert from "../../../../components/Alert";
import Button from "../../../../components/Button";
import Eyebrow from "../../../../components/Eyebrow";
import SettingsSection from "./SettingsSection";
import { buttonClasses } from "../../../../lib/buttonClasses";
import { FREE_MONTHLY_CREDITS, getRemainingCredits } from "../../../../lib/credits";
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

    // Only the free credits spend, so the bar shows those even on a paid plan.
    const freeCredits = Math.max(0, user?.freeCredits ?? 0);
    const usedCredits = Math.min(Math.max(0, user?.usedCredits ?? 0), freeCredits);
    const remainingCredits = getRemainingCredits(user);
    const subscriptionCredits = user?.subscriptionCredits ?? 0;
    const packCredits = user?.packCredits ?? 0;
    const showLockedCredits = subscriptionCredits > 0 || packCredits > 0;
    const usagePercentage = freeCredits > 0 ? (usedCredits / freeCredits) * 100 : 0;

    // Unverified accounts have no refill date yet, so the line stays hidden for them.
    const formattedResetDate = user?.creditsResetAt ? formatDate(user.creditsResetAt) : null;

    return (
        <SettingsSection title="Plan and credits">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-lg font-medium tracking-[-0.015em] text-text-primary">{planName}</h3>
                        {/* A status only means something for a paid subscription */}
                        {isSubscribed && (
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] ${
                                    isPastDue ? "border-warning/30 text-warning" : "border-success/30 text-success"
                                }`}
                            >
                                <span aria-hidden="true" className={`size-1.5 rounded-full ${isPastDue ? "bg-warning" : "bg-success"}`} />
                                {statusText}
                            </span>
                        )}
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
                                You're on the <span className="font-medium text-text-primary">Free plan</span>. You can
                                try Pro, Ultra or a credit pack with a test card.
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

            <Alert variant="info" className="mt-6">
                Payments run in Paddle test mode because Eyecatch AI is a portfolio project, so no real money is
                charged. Credits from plans and credit packs are shown here but can't be spent. Thumbnails always
                use your free credits.
            </Alert>

            <div className="mt-6 border-t border-border pt-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <Eyebrow>Free credits</Eyebrow>
                    <span className="font-mono text-sm tabular-nums text-text-secondary">
                        <span className="text-text-primary">{usedCredits}</span> / {freeCredits} used
                    </span>
                </div>

                <div
                    role="progressbar"
                    aria-label="Free credits used"
                    aria-valuenow={Math.round(usagePercentage)}
                    className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background-surface-2"
                >
                    <div
                        className="h-full rounded-full bg-text-primary transition-[width] duration-300"
                        style={{ width: `${usagePercentage}%` }}
                    />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-text-muted">
                    <span className="tabular-nums">{remainingCredits} left this cycle</span>
                    {formattedResetDate && <span>Refills to {FREE_MONTHLY_CREDITS} on {formattedResetDate}</span>}
                </div>
            </div>

            {showLockedCredits && (
                <div className="mt-6 border-t border-border pt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <Eyebrow>Test mode credits</Eyebrow>
                        <span className="font-mono text-xs uppercase tracking-[0.06em] text-text-muted">Can't be spent</span>
                    </div>
                    <dl className="mt-3 space-y-2 text-sm">
                        {subscriptionCredits > 0 && (
                            <div className="flex justify-between gap-4">
                                <dt className="text-text-secondary">Subscription credits</dt>
                                <dd className="font-mono tabular-nums text-text-primary">
                                    {subscriptionCredits.toLocaleString("en-US")} / month
                                </dd>
                            </div>
                        )}
                        {packCredits > 0 && (
                            <div className="flex justify-between gap-4">
                                <dt className="text-text-secondary">Pack credits</dt>
                                <dd className="font-mono tabular-nums text-text-primary">
                                    {packCredits.toLocaleString("en-US")}
                                </dd>
                            </div>
                        )}
                        <div className="flex justify-between gap-4 border-t border-border pt-2">
                            <dt className="text-text-secondary">Total credits, free included</dt>
                            <dd className="font-mono tabular-nums text-text-primary">
                                {(user?.totalCredits ?? 0).toLocaleString("en-US")}
                            </dd>
                        </div>
                    </dl>
                    <p className="mt-3 text-xs leading-relaxed text-text-muted">
                        Bought with a test card, so they're shown but locked.
                    </p>
                </div>
            )}
        </SettingsSection>
    );
}
