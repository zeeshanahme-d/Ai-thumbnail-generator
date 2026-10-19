import type { LegalSectionProps } from "../../../types";

export default function LegalSection({ section, number }: LegalSectionProps) {
    const { id, title, paragraphs, list } = section;

    return (
        <section id={id} className="scroll-mt-24">
            <h2 className="flex items-baseline gap-3 text-lg font-medium tracking-[-0.015em] text-text-primary sm:text-xl">
                <span className="font-mono text-sm tabular-nums text-text-muted">{String(number).padStart(2, "0")}</span>
                {title}
            </h2>

            {paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 max-w-[68ch] text-[0.9375rem] leading-7 text-text-secondary">
                    {paragraph}
                </p>
            ))}

            {list && (
                <ul className="mt-4 max-w-[68ch] space-y-2.5">
                    {list.map((item) => (
                        <li key={item} className="flex gap-3 text-[0.9375rem] leading-7 text-text-secondary">
                            <span aria-hidden="true" className="mt-3 size-1 shrink-0 rounded-full bg-text-muted" />
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
