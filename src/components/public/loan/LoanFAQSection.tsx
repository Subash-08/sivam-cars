'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
    question: string;
    answer: string;
}

const faqs: FaqItem[] = [
    {
        question: 'What is the minimum down payment?',
        answer: 'The minimum down payment is typically 10% of the car value. However, this may vary depending on the lending partner and your credit profile. Some banks may offer up to 90% financing for eligible applicants.',
    },
    {
        question: 'How long does loan approval take?',
        answer: 'Most loan applications are processed within 24–48 hours. Once you submit your documents and application, our banking partners review it quickly. In many cases, you can receive approval within the same day.',
    },
    {
        question: 'Can I prepay my car loan?',
        answer: 'Yes, most of our lending partners allow part or full prepayment of the loan after a lock-in period (usually 6–12 months). Some banks may charge a nominal foreclosure fee, while others offer zero-penalty prepayment.',
    },
    {
        question: 'Do you provide loans for used cars?',
        answer: 'Absolutely! All our financing options are specifically tailored for pre-owned vehicles. Our banking partners offer competitive rates for used car loans with tenure up to 7 years depending on the vehicle age.',
    },
    {
        question: 'Can self-employed people apply?',
        answer: 'Yes, self-employed individuals are eligible to apply. You will need to provide ITR returns, bank statements, and standard KYC documents. Our team will help you choose the best lending partner for your profile.',
    },
];

export default function LoanFAQSection(): React.JSX.Element {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number): void => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section className="bg-muted py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        FAQs
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Frequently Asked{' '}
                        <span className="text-primary">Questions</span>
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        Have questions? We&apos;ve got answers.
                    </p>
                </div>

                <div className="mt-12 space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={faq.question}
                                className="rounded-xl border border-border bg-card transition-shadow duration-200 card-elevated"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(index)}
                                    className="flex w-full items-center justify-between px-5 py-4 text-left sm:px-6"
                                    aria-expanded={isOpen}
                                    aria-controls={`loan-faq-panel-${index}`}
                                >
                                    <span className="pr-4 text-sm font-semibold text-foreground sm:text-base">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                            }`}
                                        aria-hidden="true"
                                    />
                                </button>

                                <div
                                    id={`loan-faq-panel-${index}`}
                                    role="region"
                                    className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen
                                            ? 'max-h-96 opacity-100'
                                            : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
