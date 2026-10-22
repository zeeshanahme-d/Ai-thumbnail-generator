import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Eyebrow from "../../../components/Eyebrow";
import { legalDocuments } from "../../../data/legal";
import type { RelatedLegalDocsProps } from "../../../types";

export default function RelatedLegalDocs({ currentId }: RelatedLegalDocsProps) {
    const related = Object.values(legalDocuments).filter(({ id }) => id !== currentId);

    return (
        <nav aria-label="Related policies" className="mt-12 lg:mt-16">
            <Eyebrow>Related policies</Eyebrow>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map(({ id, title, path, summary }) => (
                    <Link
                        key={id}
                        to={path}
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-background-card p-5 shadow-card transition-colors hover:border-border-strong"
                    >
                        <div>
                            <p className="text-base font-medium text-text-primary">{title}</p>
                            <p className="mt-1 text-sm text-text-secondary">{summary}</p>
                        </div>
                        <ArrowRight
                            size={18}
                            className="shrink-0 text-text-muted transition-colors group-hover:text-text-primary"
                        />
                    </Link>
                ))}
            </div>
        </nav>
    );
}
