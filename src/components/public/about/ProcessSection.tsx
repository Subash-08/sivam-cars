'use client';

import { useEffect, useRef, useState } from 'react';
import { Car, ClipboardCheck, ListChecks, Truck } from 'lucide-react';

interface ProcessStep {
    step: number;
    icon: typeof Car;
    title: string;
    description: string;
}

const steps: ProcessStep[] = [
    {
        step: 1,
        icon: Car,
        title: 'Vehicle Selection',
        description:
            'We carefully handpick pre-owned vehicles from trusted sources, focusing on quality, reliability, and value.',
    },
    {
        step: 2,
        icon: ClipboardCheck,
        title: 'Inspection & Verification',
        description:
            'Each vehicle undergoes a thorough multi-point inspection. Documents, mileage, ownership history — everything is verified.',
    },
    {
        step: 3,
        icon: ListChecks,
        title: 'Transparent Listing',
        description:
            'Cars are listed with clear photos, honest descriptions, and upfront pricing.',
    },
    {
        step: 4,
        icon: Truck,
        title: 'Support & Delivery',
        description:
            'From test drive scheduling to paperwork and delivery, we provide end-to-end assistance.',
    },
];

export default function ProcessSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState<number[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const totalHeight = rect.height;
            const visibleHeight = Math.min(
                totalHeight,
                Math.max(0, windowHeight - rect.top)
            );

            const percentage = Math.min(
                100,
                (visibleHeight / totalHeight) * 100
            );

            setProgress(percentage);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const elements = document.querySelectorAll('.process-step');

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = Number(
                            entry.target.getAttribute('data-index')
                        );
                        setVisible(prev =>
                            prev.includes(index) ? prev : [...prev, index]
                        );
                    }
                });
            },
            { threshold: 0.25 }
        );

        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="bg-background py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        How It Works
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Our <span className="text-primary">Process</span>
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        A streamlined journey from selection to delivery.
                    </p>
                </div>

                {/* Timeline */}
                <div
                    ref={containerRef}
                    className="relative mx-auto mt-16 max-w-3xl"
                >
                    {/* Base Line */}
                    <div className="absolute left-6 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-px" />

                    {/* Animated Gradient Line (Primary → Red Accent) */}
                    <div
                        className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-primary via-primary to-red-500 transition-all duration-300 ease-out md:left-1/2 md:-translate-x-px"
                        style={{ height: `${progress}%` }}
                    />

                    <div className="space-y-6 md:space-y-8">
                        {steps.map((item, index) => {
                            const isEven = index % 2 === 0;
                            const isVisible = visible.includes(index);

                            return (
                                <div
                                    key={item.title}
                                    data-index={index}
                                    className="process-step relative flex items-start gap-6 md:gap-0"
                                >
                                    {/* Step Circle */}
                                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card shadow-sm md:absolute md:left-1/2 md:-translate-x-1/2">

                                        {/* Red Glow Pulse when visible */}
                                        {isVisible && (
                                            <span className="absolute inset-0 rounded-full bg-red-500/20 blur-md animate-pulse" />
                                        )}

                                        <item.icon className="relative h-5 w-5 text-primary" />
                                    </div>

                                    {/* Content Card */}
                                    <div
                                        className={`
                                            relative w-full rounded-xl border border-border bg-card p-6 shadow-sm
                                            transition-all duration-700 ease-out
                                            hover:shadow-lg hover:border-primary/30
                                            md:w-[calc(50%-2.5rem)]
                                            ${isEven
                                                ? 'md:mr-auto md:text-right'
                                                : 'md:ml-auto md:text-left'}
                                            ${isVisible
                                                ? 'opacity-100 translate-x-0'
                                                : isEven
                                                    ? 'opacity-0 -translate-x-10'
                                                    : 'opacity-0 translate-x-10'
                                            }
                                        `}
                                    >
                                        {/* Red Accent Stripe */}
                                        <span className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-l-xl opacity-70" />

                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                            {item.step}
                                        </span>

                                        <h3 className="mt-3 text-base font-bold text-foreground sm:text-lg">
                                            {item.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}