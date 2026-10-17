import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createPortalSession } from "../_requests";
import { getApiErrorMessage } from "../../../lib/axios";

// Sends the user to Paddle's customer portal to cancel, change the card or download invoices.
export function useBillingPortal() {
    const { mutate, isPending } = useMutation({
        mutationFn: createPortalSession,
        onSuccess: (url) => window.location.assign(url),
        onError: (error) => toast.error(getApiErrorMessage(error, "Couldn't open billing.")),
    });

    return { openPortal: () => mutate(), isPending };
}
