import api from "../../lib/axios";
import type { ApiSuccess } from "../auth/_models";
import type { CheckoutPayload } from "../../types";

export const BILLING_URL = {
    checkout: "/billing/checkout",
    portal: "/billing/portal",
};

// The server creates the Paddle transaction, so the plan and account link never come from the browser.
export async function createCheckout(payload: CheckoutPayload) {
    const { data } = await api.post<ApiSuccess<{ transactionId: string }>>(BILLING_URL.checkout, payload);
    return (data.data as { transactionId: string }).transactionId;
}

export async function createPortalSession() {
    const { data } = await api.post<ApiSuccess<{ url: string }>>(BILLING_URL.portal);
    return (data.data as { url: string }).url;
}
