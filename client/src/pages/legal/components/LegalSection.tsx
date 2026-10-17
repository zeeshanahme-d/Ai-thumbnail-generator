import type { LegalSectionProps } from "../../../types";

export default function LegalSection({ section, number }: LegalSectionProps) {
    const { id, title, paragraphs, list } = section;

    return (
        <section id={id} className="scroll-mt-28">
            <h2 className="flex gap-3 text-lg font-semibold text-text-primary sm:text-xl">
                <span className="text-primary">{String(number).padStart(2, "0")}</span>
                {title}
            </h2>

            {paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-7 text-text-secondary sm:text-[15px]">
                    {paragraph}
                </p>
            ))}

            {list && (
                <ul className="mt-4 space-y-2.5">
                    {list.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-7 text-text-secondary sm:text-[15px]">
                            <span aria-hidden="true" className="mt-2.75 size-1.5 shrink-0 rounded-full bg-primary" />
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
