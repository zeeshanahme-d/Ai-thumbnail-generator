import Wrapper from "../components/Wrapper";
import SectionTitle from "../components/SectionTitle";
import FaqAccordion from "../components/FaqAccordion";
import { generalFaqs } from "../data/faq";

export default function FaqSection() {
    return (
        <section id="faq" className="scroll-mt-16 py-(--section-y)">
            <Wrapper className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                {/* The title stays in view while the answers scroll past it. */}
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-28">
                        <SectionTitle
                            align="start"
                            text1="FAQ"
                            text2={["Questions,", "answered."]}
                            text3="Everything to know before you create your first thumbnail."
                        />
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <FaqAccordion items={generalFaqs} />
                </div>
            </Wrapper>
        </section>
    );
}
