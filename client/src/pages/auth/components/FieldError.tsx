import type { AnyFieldMeta } from "@tanstack/react-form";

// Shows the first validation issue once the field has been touched.
export default function FieldError({ meta }: { meta: AnyFieldMeta }) {
    if (!meta.isTouched) return null;

    const message = meta.errors
        .map((error: unknown) =>
            typeof error === "string"
                ? error
                : (error as { message?: string } | null)?.message,
        )
        .find((text): text is string => typeof text === "string" && text.length > 0);

    if (!message) return null;

    return <p className="mt-1.5 text-xs text-primary">{message}</p>;
}
