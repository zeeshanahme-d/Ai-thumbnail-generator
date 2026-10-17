import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCheckout } from "../_requests";
import { useSyncSessionUser } from "../../auth/hooks";
import { getApiErrorMessage } from "../../../lib/axios";
import { openPaddleCheckout } from "../../../lib/paddle";
import type { CheckoutPayload, IUser } from "../../../types";

const SYNC_ATTEMPTS = 10;
const SYNC_INTERVAL_MS = 2000;

// The plan and its credits arrive through Paddle's webhook a moment after payment.
const isPaidUp = (user: IUser) =>
    user.plan !== "free" && Boolean(user.subscriptionPeriodEnd) && new Date(user.subscriptionPeriodEnd!) > new Date();

// Opens Paddle Checkout for a plan, then re-reads the account until the webhook has applied it.
export function useCheckout() {
    const syncSessionUser = useSyncSessionUser();

    const waitForPlan = async () => {
        for (let attempt = 0; attempt < SYNC_ATTEMPTS; attempt++) {
            await new Promise((resolve) => setTimeout(resolve, SYNC_INTERVAL_MS));
            const user = await syncSessionUser().catch(() => null);
            if (user && isPaidUp(user)) {
                toast.success("Your plan is active. Your new credits are ready.");
                return;
            }
        }
        toast("Payment received. Your plan will appear in a minute.");
    };

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: CheckoutPayload) => {
            const transactionId = await createCheckout(payload);
            await openPaddleCheckout(transactionId, () => void waitForPlan());
        },
        onError: (error) =>
            toast.error(getApiErrorMessage(error, error instanceof Error ? error.message : "Couldn't open checkout.")),
    });

    return { startCheckout: mutate, isPending };
}
