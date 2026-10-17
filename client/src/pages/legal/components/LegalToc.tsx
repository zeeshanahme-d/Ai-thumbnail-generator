import type { LegalTocProps } from "../../../types";

export default function LegalToc({ sections }: LegalTocProps) {
    return (
        <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-28">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">On this page</p>
                <ol className="mt-4 border-l border-border">
                    {sections.map(({ id, title }) => (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-text-secondary transition hover:border-primary hover:text-primary"
                            >
                                {title}
                            </a>
                        </li>
                    ))}
                </ol>
            </nav>
        </aside>
    );
}
