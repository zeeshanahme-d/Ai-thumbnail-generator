import api from "../../lib/axios";
import type { ApiSuccess } from "../auth/_models";
import type { CheckoutPayload, CreditPackCheckoutPayload } from "../../types";

export const BILLING_URL = {
    checkout: "/billing/checkout",
    credits: "/billing/credits",
    portal: "/billing/portal",
};

// The server creates the Paddle transaction, so the plan and account link never come from the browser.
export async function createCheckout(payload: CheckoutPayload) {
    const { data } = await api.post<ApiSuccess<{ transactionId: string }>>(BILLING_URL.checkout, payload);
    return (data.data as { transactionId: string }).transactionId;
}

export async function createCreditPackCheckout(payload: CreditPackCheckoutPayload) {
    const { data } = await api.post<ApiSuccess<{ transactionId: string }>>(BILLING_URL.credits, payload);
    return (data.data as { transactionId: string }).transactionId;
}

export async function createPortalSession() {
    const { data } = await api.post<ApiSuccess<{ url: string }>>(BILLING_URL.portal);
    return (data.data as { url: string }).url;
}
