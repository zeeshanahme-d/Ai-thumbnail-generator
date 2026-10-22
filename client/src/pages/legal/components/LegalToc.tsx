import Eyebrow from "../../../components/Eyebrow";
import type { LegalTocProps } from "../../../types";

export default function LegalToc({ sections }: LegalTocProps) {
    return (
        <aside className="hidden lg:col-span-3 lg:block">
            <nav aria-label="On this page" className="sticky top-24">
                <Eyebrow>On this page</Eyebrow>
                <ol className="mt-4 border-l border-border">
                    {sections.map(({ id, title }) => (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
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
