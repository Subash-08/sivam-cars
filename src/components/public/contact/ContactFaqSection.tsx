'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface FaqItem {
    question: string;
    answer: string;
}

const faqs: FaqItem[] = [
    {
        question: 'How can I book a car viewing?',
        answer: `You can call us directly at ${siteConfig.phone} or send us a message through the contact form above. Our team will schedule a convenient time for you to visit the showroom and inspect the vehicle in person.`,
    },
    {
        question: 'Do you offer financing assistance?',
        answer: `Yes, we help our customers with loan pre-approval and financing options through our trusted banking partners. Visit our loan page or contact us to discuss your requirements and get personalized assistance.`,
    },
    {
        question: 'Are the cars inspected before listing?',
        answer: `Absolutely. Every vehicle in our inventory goes through a rigorous multi-point inspection covering the engine, transmission, electricals, body condition, and documentation. We only list cars that meet our quality standards.`,
    },
    {
        question: 'Where are you located?',
        answer: `We are located at ${siteConfig.address}. Our showroom is open ${siteConfig.workingHours}. Feel free to walk in or schedule a visit by contacting us.`,
    },
];

export default function ContactFaqSection(): React.JSX.Element {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number): void => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section className="bg-muted py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        Quick answers to common queries about our services.
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
                                    aria-controls={`faq-panel-${index}`}
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
                                    id={`faq-panel-${index}`}
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
