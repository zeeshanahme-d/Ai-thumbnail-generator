import SectionTitle from "../../../components/SectionTitle";
import Reveal from "../../../components/Reveal";
import { creditFacts } from "../../../data/pricing";

export default function CreditFacts() {
    return (
        <section className="mt-24 md:mt-32">
            <SectionTitle
                text1="Credits"
                text2="How credits work"
                text3="One simple currency for every thumbnail, with no hidden costs."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
                {creditFacts.map(({ icon: Icon, title, description }, index) => (
                    <Reveal key={title} delay={index * 0.1}>
                        <div className="group h-full rounded-2xl border border-border bg-background-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-[0_18px_40px_-24px_rgba(230,57,70,0.4)]">
                            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-text-on-primary">
                                <Icon size={20} />
                            </span>
                            <h3 className="mt-5 text-base font-semibold text-text-primary">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
