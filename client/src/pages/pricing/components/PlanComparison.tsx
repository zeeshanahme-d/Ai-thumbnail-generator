import { Check, Minus } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle";
import Reveal from "../../../components/Reveal";
import { planComparison, pricingPlans } from "../../../data/pricing";
import type { ComparisonValueProps } from "../../../types";

export default function PlanComparison() {
    return (
        <section className="mt-24 md:mt-32">
            <SectionTitle
                text1="Compare"
                text2="Compare every feature"
                text3="See exactly what each plan includes."
            />

            <Reveal className="mx-auto mt-10 max-w-4xl md:mt-12">
                <div className="overflow-x-auto rounded-2xl border border-border bg-background-card">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th scope="col" className="px-4 py-4 font-medium text-text-muted sm:px-6">
                                    Features
                                </th>
                                {pricingPlans.map(({ name, mostPopular }) => (
                                    <th
                                        key={name}
                                        scope="col"
                                        className={`px-2 py-4 text-center text-base font-semibold sm:px-6 ${mostPopular ? "bg-primary/5 text-primary" : "text-text-primary"}`}
                                    >
                                        {name}
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
                                            className={`px-2 py-3.5 text-center sm:px-6 ${pricingPlans[index].mostPopular ? "bg-primary/5" : ""}`}
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
        </section>
    );
}

function ComparisonValue({ value }: ComparisonValueProps) {
    if (typeof value === "string") {
        return <span className="font-medium text-text-primary">{value}</span>;
    }

    return value ? (
        <>
            <Check size={18} aria-hidden="true" className="mx-auto text-primary" />
            <span className="sr-only">Included</span>
        </>
    ) : (
        <>
            <Minus size={18} aria-hidden="true" className="mx-auto text-text-muted" />
            <span className="sr-only">Not included</span>
        </>
    );
}
