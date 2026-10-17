import Wrapper from "../components/Wrapper";
import SectionTitle from "../components/SectionTitle";
import FaqAccordion from "../components/FaqAccordion";
import { generalFaqs } from "../data/faq";

export default function FaqSection() {
    return (
        <section id="faq" className="scroll-mt-24 py-16 md:py-24">
            <Wrapper>
                <SectionTitle
                    text1="FAQ"
                    text2={<>Questions? <span className="text-primary">Answered.</span></>}
                    text3="Everything you need to know before you create your first thumbnail."
                />

                <div className="mx-auto mt-10 max-w-3xl md:mt-12">
                    <FaqAccordion items={generalFaqs} />
                </div>
            </Wrapper>
        </section>
    );
}
