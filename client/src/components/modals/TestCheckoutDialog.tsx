import ConfirmDialog from "./confirmation-dialog/ConfirmDialog";
import { FREE_MONTHLY_CREDITS } from "../../lib/credits";
import type { TestCheckoutDialogProps } from "../../types";

// Paddle's sandbox test card: https://developer.paddle.com/concepts/payment-methods/card
const TEST_CARD = [
    { label: "Card number", value: "4242 4242 4242 4242" },
    { label: "Expiry date", value: "Any future date" },
    { label: "Security code", value: "100" },
    { label: "Name on card", value: "Any name" },
];

/** Shown before every checkout: payments run in Paddle test mode and bought credits can't be spent. */
export default function TestCheckoutDialog({ open, onClose, onProceed }: TestCheckoutDialogProps) {
    return (
        <ConfirmDialog
            open={open}
            onClose={onClose}
            onConfirm={onProceed}
            title="Test mode payment"
            description="Eyecatch AI is a portfolio project, so payments run in Paddle's test mode and no money is charged. Don't enter your real card. Use this test card instead:"
            confirmLabel="Proceed"
        >
            <dl className="rounded-lg border border-border bg-background-surface px-4 py-3 text-sm">
                {TEST_CARD.map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4 py-1">
                        <dt className="text-text-muted">{label}</dt>
                        <dd className="font-mono tabular-nums text-text-primary">{value}</dd>
                    </div>
                ))}
            </dl>
            <p className="mt-3 text-center text-xs leading-relaxed text-text-muted">
                Credits you buy show up in Settings but can't be spent. Thumbnails always use your{" "}
                {FREE_MONTHLY_CREDITS} free monthly credits.
            </p>
        </ConfirmDialog>
    );
}
