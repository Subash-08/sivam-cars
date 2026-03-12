'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'Can I buy verified used cars in Kallakurichi from SivamCars?',
        answer: 'Yes! SivamCars offers a wide selection of thoroughly inspected pre-owned vehicles right here in Kallakurichi. Every car passes strict quality checks before sales.',
    },
    {
        question: 'Does SivamCars provide car loan and EMI options?',
        answer: 'Absolutely. We partner with trusted financial institutions to provide affordable used car loan options and flexible EMIs to make your purchase seamless.',
    },
    {
        question: 'Can I schedule a test drive in Attur?',
        answer: 'Yes, you can schedule a test drive for any of our second-hand cars. Reach out to our team to arrange a convenient time and location for you, including near Attur.',
    },
    {
        question: 'Do you deliver cars to Salem or Ulundurpet?',
        answer: 'We proudly serve customers across Tamil Nadu, including Salem, Ulundurpet, and Villupuram. Contact us directly to discuss delivery or viewing arrangements.',
    },
    {
        question: 'Are all your vehicles checked and verified?',
        answer: 'Yes. Every used car undergoes a comprehensive 100+ point mechanical and documentation inspection to ensure you get complete peace of mind with your purchase.',
    },
];

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0); // 0 opens the first item by default

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };

    return (
        <section className="py-16 sm:py-20 bg-zinc-50 relative overflow-hidden">
            <Script
                id="faq-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
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