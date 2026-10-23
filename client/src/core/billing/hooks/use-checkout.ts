import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCheckout, createCreditPackCheckout } from "../_requests";
import { useSyncSessionUser } from "../../auth/hooks";
import { getApiErrorMessage } from "../../../lib/axios";
import { PAID_CREDITS_SPENDABLE } from "../../../lib/credits";
import { openPaddleCheckout } from "../../../lib/paddle";
import { useSession } from "../../../store/useSessionStore";
import type { CheckoutPayload, CreditPackCheckoutPayload, IUser } from "../../../types";

const SYNC_ATTEMPTS = 10;
const SYNC_INTERVAL_MS = 2000;

// The plan and its credits arrive through Paddle's webhook a moment after payment.
const isPaidUp = (user: IUser) =>
    user.plan !== "free" && Boolean(user.subscriptionPeriodEnd) && new Date(user.subscriptionPeriodEnd!) > new Date();

// Opens Paddle Checkout for a plan or a credit pack, then re-reads the account until the webhook has applied it.
export function useCheckout() {
    const syncSessionUser = useSyncSessionUser();

    const waitFor = async (isApplied: (user: IUser) => boolean, done: string, later: string) => {
        for (let attempt = 0; attempt < SYNC_ATTEMPTS; attempt++) {
            await new Promise((resolve) => setTimeout(resolve, SYNC_INTERVAL_MS));
            const user = await syncSessionUser().catch(() => null);
            if (user && isApplied(user)) {
                toast.success(done);
                return;
            }
        }
        toast(later);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: CheckoutPayload | CreditPackCheckoutPayload) => {
            if ("credits" in payload) {
                const packBefore = useSession.getState().user?.packCredits ?? 0;
                const transactionId = await createCreditPackCheckout(payload);
                await openPaddleCheckout(transactionId, () =>
                    void waitFor(
                        (user) => (user.packCredits ?? 0) > packBefore,
                        PAID_CREDITS_SPENDABLE
                            ? `${payload.credits.toLocaleString("en-US")} credits added to your account.`
                            : `${payload.credits.toLocaleString("en-US")} test credits added. You can see them in Settings.`,
                        "Payment received. Your credits will appear in a minute.",
                    ),
                );
                return;
            }

            const transactionId = await createCheckout(payload);
            await openPaddleCheckout(transactionId, () =>
                void waitFor(
                    isPaidUp,
                    PAID_CREDITS_SPENDABLE
                        ? "Your plan is active. Your new credits are ready."
                        : "Your test plan is active. You can see it in Settings.",
                    "Payment received. Your plan will appear in a minute.",
                ),
            );
        },
        onError: (error) =>
            toast.error(getApiErrorMessage(error, error instanceof Error ? error.message : "Couldn't open checkout.")),
    });

    return { startCheckout: mutate, isPending };
}
