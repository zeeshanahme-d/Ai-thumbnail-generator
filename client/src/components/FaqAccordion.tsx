import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import Reveal from "./Reveal";
import { EASE_OUT } from "../lib/motion";
import type { FaqAccordionProps, FaqItemProps } from "../types";

export default function FaqAccordion({ items }: FaqAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-3">
            {items.map((faq, index) => (
                <Reveal key={faq.question} delay={index * 0.05}>
                    <FaqItem
                        faq={faq}
                        number={index + 1}
                        isOpen={openIndex === index}
                        onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                </Reveal>
            ))}
        </div>
    );
}

function FaqItem({ faq, number, isOpen, onToggle }: FaqItemProps) {
    const id = useId();

    return (
        <div
            className={`rounded-2xl border bg-background-card transition-[border-color,box-shadow] duration-300 ${isOpen
                ? "border-border-strong shadow-card"
                : "border-border hover:border-border-strong"
                }`}
        >
            <h3>
                <button
                    type="button"
                    id={`${id}-question`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-answer`}
                    onClick={onToggle}
                    className="flex w-full cursor-pointer items-center gap-4 rounded-2xl px-5 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-6"
                >
                    <span className={`w-6 shrink-0 font-mono text-sm tabular-nums transition-colors ${isOpen ? "text-text-primary" : "text-text-muted"}`}>
                        {String(number).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-medium text-text-primary sm:text-base">{faq.question}</span>
                    <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] ${isOpen
                            ? "border-text-primary bg-text-primary text-background"
                            : "border-border text-text-secondary"
                            }`}
                    >
                        <Plus size={16} />
                    </motion.span>
                </button>
            </h3>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="answer"
                        id={`${id}-answer`}
                        role="region"
                        aria-labelledby={`${id}-question`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 pl-15 pr-5 text-sm leading-relaxed text-text-secondary sm:pl-16 sm:pr-16">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
