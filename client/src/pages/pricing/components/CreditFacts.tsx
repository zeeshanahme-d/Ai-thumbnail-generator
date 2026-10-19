import Wrapper from "../../../components/Wrapper";
import SectionTitle from "../../../components/SectionTitle";
import Reveal from "../../../components/Reveal";
import { creditFacts } from "../../../data/pricing";
import { STAGGER } from "../../../lib/motion";

// How credits work, as a numbered spec row rather than a grid of icon cards.
export default function CreditFacts() {
    return (
        <section className="py-(--section-y)">
            <Wrapper>
                <SectionTitle
                    align="split"
                    text1="Credits"
                    text2={["How credits", "work."]}
                    text3="One simple currency for every thumbnail, with no hidden costs."
                />

                <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
                    {creditFacts.map(({ title, description }, index) => (
                        <Reveal key={title} delay={index * STAGGER} className="border-t border-border pt-6">
                            <span className="font-mono text-xs tabular-nums text-text-muted">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <dt className="mt-4 text-lg font-medium tracking-[-0.015em] text-text-primary">{title}</dt>
                            <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</dd>
                        </Reveal>
                    ))}
                </dl>
            </Wrapper>
        </section>
    );
}
