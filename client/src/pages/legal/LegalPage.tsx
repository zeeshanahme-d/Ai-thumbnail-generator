import Wrapper from "../../components/Wrapper";
import SectionTitle from "../../components/SectionTitle";
import LegalToc from "./components/LegalToc";
import LegalSection from "./components/LegalSection";
import RelatedLegalDocs from "./components/RelatedLegalDocs";
import { legalDocuments } from "../../data/legal";
import type { LegalPageProps } from "../../types";

export default function LegalPage({ documentId }: LegalPageProps) {
    const { title, summary, updatedAt, sections } = legalDocuments[documentId];

    return (
        <main className="py-12 md:py-20">
            <Wrapper>
                <SectionTitle as="h1" animate={false} text1="Legal" text2={title} text3={summary} />
                <p className="mt-3 text-center text-xs text-text-muted">Last updated {updatedAt}</p>

                <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
                    <LegalToc sections={sections} />
                    <article className="space-y-10 rounded-2xl border border-border bg-background-card p-6 sm:p-10">
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
