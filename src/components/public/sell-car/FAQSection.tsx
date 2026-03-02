'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'How long does the payment take?',
        answer: 'We transfer the money instantly to your bank account via IMPS/RTGS as soon as you sign the agreement. It typically takes 15-30 minutes.',
    },
    {
        question: 'Is the inspection really free?',
        answer: 'Yes, our doorstep inspection is 100% free with no obligation to sell. You can choose to decline our offer if you are not satisfied.',
    },
    {
        question: 'Can I sell a financed car?',
        answer: 'Absolutely! We handle the loan foreclosure process for you. We will pay the bank directly and transfer the remaining balance to you.',
    },
    {
        question: 'Do you charge any commission?',
        answer: 'No, we do not charge any commission or service fee from the seller. The price we offer is the net amount you receive.',
    },
    {
        question: 'What documents are required?',
        answer: 'You will need the RC (Registration Certificate), Insurance policy, PUC certificate, and your KYC documents (Aadhar/PAN).',
    },
];

export default function FAQSection(): React.JSX.Element {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number): void => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="bg-background py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
                    Frequently Asked{' '}
                    <span className="text-red-600">Questions</span>
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground sm:mb-12 sm:text-base">
                    Everything you need to know about selling your car through
                    SivamCars.
                </p>

                {/* FAQ Accordion */}
                <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                    {faqs.map((faq, index) => {
                        const isOpen = activeIndex === index;

                        return (
                            <div
                                key={faq.question}
                                itemScope
                                itemType="https://schema.org/Question"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFAQ(index)}
                                    className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-semibold text-foreground transition-colors hover:bg-muted sm:px-6 sm:py-5 sm:text-lg"
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span itemProp="name" className="pr-4">
                                        {faq.question}
                                    </span>
                                    {isOpen ? (
                                        <ChevronUp
                                            className="h-5 w-5 shrink-0 text-red-600"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <ChevronDown
                                            className="h-5 w-5 shrink-0 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>

                                <div
                                    id={`faq-answer-${index}`}
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen
                                            ? 'grid-rows-[1fr] opacity-100'
                                            : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                    itemScope
                                    itemType="https://schema.org/Answer"
                                    itemProp="acceptedAnswer"
                                >
                                    <div className="overflow-hidden">
                                        <div
                                            className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6 sm:text-base"
                                            itemProp="text"
                                        >
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer CTA */}
                <div className="mt-12 text-center sm:mt-16">
                    <p className="mb-5 text-sm text-muted-foreground sm:text-base">
                        Have more questions about selling your car?
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block rounded-full border border-red-600 px-8 py-3 font-bold text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white"
                    >
                        Contact Our Experts
                    </Link>
                </div>
            </div>
        </section>
    );
}
