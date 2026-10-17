import type { ReactNode } from "react";
import type { AnyFieldMeta } from "@tanstack/react-form";

function firstIssue(meta: AnyFieldMeta) {
    return meta.errors
        .map((error: unknown) =>
            typeof error === "string"
                ? error
                : (error as { message?: string } | null)?.message,
        )
        .find((text): text is string => typeof text === "string" && text.length > 0);
}

interface FieldErrorProps {
    meta?: AnyFieldMeta;
    message?: string | null;
    /** Shown on the same line while there is no error, e.g. a username availability hint. */
    children?: ReactNode;
}

// Shows `message` when given (e.g. a server error), otherwise the first validation
// issue once the field has been touched, otherwise `children`.
// The line is always rendered and its negative bottom margin cancels its 20px height, so it
// sits in the gap under the input and a message never moves the layout. Forms leave a 26px
// gap below each field (space-y-6.5), which keeps 6px under the message; a message that
// wraps only adds its extra lines.
export default function FieldError({ meta, message, children }: FieldErrorProps) {
    const text = message || (meta?.isTouched ? firstIssue(meta) : undefined);

    return <p className="mt-1 -mb-5 min-h-4 text-xs leading-4 text-primary">{text || children}</p>;
}
