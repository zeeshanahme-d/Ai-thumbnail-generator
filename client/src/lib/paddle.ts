import { CheckoutEventNames, initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useTheme } from "../store/useTheme";
import type { IUser } from "../types";

// Mirrors the live statuses in server/src/utils/billing.ts: these keep the paid plan.
const LIVE_STATUSES = ["active", "trialing", "past_due"];

export const hasLiveSubscription = (user: IUser | null | undefined) =>
    LIVE_STATUSES.includes(user?.subscriptionStatus ?? "");

let paddlePromise: Promise<Paddle | undefined> | null = null;
let onCheckoutCompleted: (() => void) | null = null;

// Paddle.js refuses a second Initialize, so the app shares one instance, loaded on first checkout.
export function getPaddle() {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    if (!token) return Promise.reject(new Error("Payments are not set up yet."));

    paddlePromise ??= initializePaddle({
        token,
        environment: import.meta.env.VITE_PADDLE_ENV === "production" ? "production" : "sandbox",
        eventCallback: (event) => {
            if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) onCheckoutCompleted?.();
        },
    }).catch((error) => {
        // A failed script load is retried on the next click instead of being cached.
        paddlePromise = null;
        throw error;
    });
    return paddlePromise;
}

/** Opens the overlay checkout for a transaction the server created. */
export async function openPaddleCheckout(transactionId: string, onCompleted: () => void) {
    const paddle = await getPaddle();
    if (!paddle) throw new Error("Checkout couldn't load. Please try again.");

    onCheckoutCompleted = onCompleted;
    paddle.Checkout.open({
        transactionId,
        settings: {
            variant: "one-page",
            // The email belongs to the signed-in account, so it can't be swapped at checkout.
            allowLogout: false,
            theme: useTheme.getState().theme,
        },
    });
}
