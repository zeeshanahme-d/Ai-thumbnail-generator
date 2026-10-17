import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { legalDocuments } from "../../../data/legal";
import type { RelatedLegalDocsProps } from "../../../types";

export default function RelatedLegalDocs({ currentId }: RelatedLegalDocsProps) {
    const related = Object.values(legalDocuments).filter(({ id }) => id !== currentId);

    return (
        <nav aria-label="Related policies" className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2">
            {related.map(({ id, title, path, summary }) => (
                <Link
                    key={id}
                    to={path}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-background-card p-5 transition-colors hover:border-primary/40"
                >
                    <div>
                        <p className="text-sm font-semibold text-text-primary">{title}</p>
                        <p className="mt-1 text-sm text-text-secondary">{summary}</p>
                    </div>
                    <ArrowRight
                        size={18}
                        className="shrink-0 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                </Link>
            ))}
        </nav>
    );
}
