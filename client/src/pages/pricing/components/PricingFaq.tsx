import { Mail } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle";
import FaqAccordion from "../../../components/FaqAccordion";
import Reveal from "../../../components/Reveal";
import { pricingFaqs } from "../../../data/faq";
import { SUPPORT_EMAIL } from "../../../data/site";

export default function PricingFaq() {
    return (
        <section className="mt-24 md:mt-32">
            <SectionTitle
                text1="FAQ"
                text2="Pricing questions"
                text3="Credits, refills, refunds and what's coming next."
            />

            <div className="mx-auto mt-10 max-w-3xl md:mt-12">
                <FaqAccordion items={pricingFaqs} />

                <Reveal className="mt-6">
                    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-border px-6 py-5 text-center sm:flex-row sm:text-left">
                        <p className="text-sm text-text-secondary">
                            <span className="font-medium text-text-primary">Still have questions?</span> We're happy to help.
                        </p>
                        <a
                            href={`mailto:${SUPPORT_EMAIL}`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                            <Mail size={16} />
                            {SUPPORT_EMAIL}
                        </a>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
