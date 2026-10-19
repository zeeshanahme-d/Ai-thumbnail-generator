import Wrapper from "../../components/Wrapper";
import PageHeader from "../../components/PageHeader";
import LegalToc from "./components/LegalToc";
import LegalSection from "./components/LegalSection";
import RelatedLegalDocs from "./components/RelatedLegalDocs";
import { legalDocuments } from "../../data/legal";
import type { LegalPageProps } from "../../types";

export default function LegalPage({ documentId }: LegalPageProps) {
    const { title, summary, updatedAt, sections } = legalDocuments[documentId];

    return (
        <main>
            <PageHeader eyebrow="Legal" title={[title]} description={summary}>
                <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-muted">Last updated {updatedAt}</p>
            </PageHeader>

            <Wrapper className="pb-(--section-y)">
                <div className="grid gap-8 lg:grid-cols-12">
                    <LegalToc sections={sections} />
                    <article className="space-y-10 rounded-2xl border border-border bg-background-card p-6 shadow-card sm:p-10 lg:col-span-9">
                        {sections.map((section, index) => (
                            <LegalSection key={section.id} section={section} number={index + 1} />
                        ))}
                    </article>
                </div>

                <RelatedLegalDocs currentId={documentId} />
            </Wrapper>
        </main>
    );
}
