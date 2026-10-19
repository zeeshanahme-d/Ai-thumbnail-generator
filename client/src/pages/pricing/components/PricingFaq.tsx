import { Mail } from "lucide-react";
import Wrapper from "../../../components/Wrapper";
import SectionTitle from "../../../components/SectionTitle";
import FaqAccordion from "../../../components/FaqAccordion";
import Reveal from "../../../components/Reveal";
import { pricingFaqs } from "../../../data/faq";
import { SUPPORT_EMAIL } from "../../../data/site";

// Same layout as the homepage FAQ: the title stays in view while the answers scroll past it.
export default function PricingFaq() {
    return (
        <section className="py-(--section-y)">
            <Wrapper className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-28">
                        <SectionTitle
                            align="start"
                            text1="FAQ"
                            text2={["Pricing", "questions."]}
                            text3="Credits, refills, refunds and what's coming next."
                        />
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <FaqAccordion items={pricingFaqs} />

                    <Reveal className="mt-6">
                        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border-strong px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-text-secondary">
                                <span className="font-medium text-text-primary">Still have questions?</span> We're happy to help.
                            </p>
                            <a
                                href={`mailto:${SUPPORT_EMAIL}`}
                                className="inline-flex items-center gap-2 text-sm font-medium text-text-primary underline-offset-4 hover:underline"
                            >
                                <Mail size={16} />
                                {SUPPORT_EMAIL}
                            </a>
                        </div>
                    </Reveal>
                </div>
            </Wrapper>
        </section>
    );
}
