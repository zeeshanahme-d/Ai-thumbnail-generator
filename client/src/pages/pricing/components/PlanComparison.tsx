import { Check, Minus } from "lucide-react";
import Wrapper from "../../../components/Wrapper";
import SectionTitle from "../../../components/SectionTitle";
import Reveal from "../../../components/Reveal";
import { planComparison, pricingPlans } from "../../../data/pricing";
import type { ComparisonValueProps } from "../../../types";

export default function PlanComparison() {
    return (
        <section className="py-(--section-y)">
            <Wrapper>
                <SectionTitle
                    align="split"
                    text1="Compare"
                    text2={["Every feature,", "side by side."]}
                    text3="See exactly what each plan includes."
                />

                <Reveal className="mt-12 lg:mt-16">
                    <div className="overflow-x-auto rounded-2xl border border-border bg-background-card shadow-card">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th scope="col" className="px-4 py-4 font-mono text-xs font-normal uppercase tracking-[0.06em] text-text-muted sm:px-6">
                                        Features
                                    </th>
                                    {pricingPlans.map(({ name, mostPopular }) => (
                                        <th
                                            key={name}
                                            scope="col"
                                            className={`px-2 py-4 text-center text-base font-medium text-text-primary sm:px-6 ${mostPopular ? "bg-background-surface" : ""}`}
                                        >
                                            {name}
                                            {mostPopular && (
                                                <span className="mt-0.5 block font-mono text-[10px] font-normal uppercase tracking-[0.06em] text-text-muted">
                                                    Most popular
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {planComparison.map(({ feature, values }) => (
                                    <tr key={feature} className="transition-colors hover:bg-background-surface">
                                        <th scope="row" className="px-4 py-3.5 font-normal text-text-secondary sm:px-6">
                                            {feature}
                                        </th>
                                        {values.map((value, index) => (
                                            <td
                                                key={pricingPlans[index].name}
                                                className={`px-2 py-3.5 text-center sm:px-6 ${pricingPlans[index].mostPopular ? "bg-background-surface" : ""}`}
                                            >
                                                <ComparisonValue value={value} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Reveal>
            </Wrapper>
        </section>
    );
}

function ComparisonValue({ value }: ComparisonValueProps) {
    if (typeof value === "string") {
        return <span className="font-medium tabular-nums text-text-primary">{value}</span>;
    }

    return value ? (
        <>
            <Check size={18} aria-hidden="true" className="mx-auto text-text-primary" />
            <span className="sr-only">Included</span>
        </>
    ) : (
        <>
            <Minus size={18} aria-hidden="true" className="mx-auto text-text-muted" />
            <span className="sr-only">Not included</span>
        </>
    );
}
