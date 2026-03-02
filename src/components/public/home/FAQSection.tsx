'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'Are all cars inspected before listing?',
        answer: 'Yes. Every vehicle undergoes a detailed inspection including engine health, mileage verification, documentation review, and road testing before being listed.',
    },
    {
        question: 'Do you provide complete service history?',
        answer: 'We provide available service records, ownership history, and documentation transparency to ensure full clarity before purchase.',
    },
    {
        question: 'Can I schedule a test drive?',
        answer: 'Absolutely. You can contact us directly to schedule a convenient test drive at our Salem location.',
    },
    {
        question: 'Is financing assistance available?',
        answer: 'Yes, we assist customers with loan processing and documentation through trusted financial partners.',
    },
    {
        question: 'Are prices negotiable?',
        answer: 'We maintain transparent and fair pricing. Serious buyers are welcome to discuss offers in person.',
    },
];

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0); // 0 opens the first item by default

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-16 sm:py-20 bg-zinc-50 relative overflow-hidden">
            {/* Subtle red background glow for light theme */}
            <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-red-600/5 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

                {/* Header */}
                <h2 className="text-center text-3xl md:text-5xl font-bold text-zinc-900 uppercase mb-4 tracking-tight">
                    Frequently Asked <span className="text-red-600">Questions</span>
                </h2>

                <p className="text-center text-zinc-600 max-w-2xl mx-auto mb-10 sm:mb-12 text-sm sm:text-base">
                    Everything you need to know about buying a premium pre-owned car in Salem.
                </p>

                {/* Unified FAQ Box - Light Theme */}
                <div className="max-w-3xl mx-auto divide-y divide-zinc-200 border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-xl shadow-zinc-200/50">
                    {faqs.map((faq, index) => {
                        const isOpen = activeIndex === index;

                        return (
                            <div
                                key={index}
                                itemScope
                                itemType="https://schema.org/Question"
                                className="bg-transparent"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center text-left px-5 py-4 sm:px-6 sm:py-5 text-zinc-900 font-semibold text-base sm:text-lg hover:bg-zinc-50 transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <span itemProp="name" className="pr-4">{faq.question}</span>
                                    <span className="text-red-600 text-2xl font-light leading-none w-6 text-center shrink-0">
                                        {isOpen ? '−' : '+'}
                                    </span>
                                </button>

                                {/* Answer container with smooth height transition */}
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                    itemScope
                                    itemType="https://schema.org/Answer"
                                    itemProp="acceptedAnswer"
                                >
                                    <div className="overflow-hidden">
                                        <div
                                            className="px-5 pb-5 sm:px-6 sm:pb-6 text-zinc-600 text-sm sm:text-base leading-relaxed"
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
                <div className="text-center mt-12 sm:mt-16">
                    <p className="text-zinc-600 mb-5 text-sm sm:text-base">
                        Have more questions about our vehicles or financing?
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block border border-red-600 text-red-600 font-bold px-8 py-3 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    >
                        Contact Our Experts
                    </Link>
                </div>

            </div>
        </section>
    );
}