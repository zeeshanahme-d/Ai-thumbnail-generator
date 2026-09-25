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

// Shows `message` when given (e.g. a server error), otherwise the first validation
// issue once the field has been touched.
export default function FieldError({ meta, message }: { meta?: AnyFieldMeta; message?: string | null }) {
    const text = message || (meta?.isTouched ? firstIssue(meta) : undefined);

    if (!text) return null;

    return <p className="mt-1 text-xs text-primary">{text}</p>;
}
