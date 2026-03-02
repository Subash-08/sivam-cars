'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ValuationSection(): React.JSX.Element {
    const svgRef = useRef<SVGCircleElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    if (svgRef.current) {
                        svgRef.current.style.transition =
                            'stroke-dashoffset 1.5s ease-out';
                        svgRef.current.style.strokeDashoffset = '70';
                    }
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    const valuationPoints = [
        'Data-driven pricing based on real market trends',
        'Transparent breakdown of your car\'s value',
        'Valid for 3 days so you can decide at your pace',
    ] as const;

    return (
        <section
            ref={sectionRef}
            className="overflow-hidden bg-muted py-20 md:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-16 lg:flex-row">
                    {/* Left — Speedometer */}
                    <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80 lg:w-1/2">
                        <svg
                            className="-rotate-90 h-full w-full"
                            viewBox="0 0 100 100"
                            aria-hidden="true"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                className="stroke-border"
                                strokeWidth="8"
                            />
                            <circle
                                ref={svgRef}
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                className="stroke-red-600"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray="283"
                                strokeDashoffset="283"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-5xl font-black text-foreground">
                                30
                            </span>
                            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Minutes
                            </span>
                            <div className="mt-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
                                To Get Offer
                            </div>
                        </div>
                    </div>

                    {/* Right — Content */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                            Get Your Car&apos;s Value in
                            <br />
                            <span className="text-red-600">Record Time</span>
                        </h2>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Don&apos;t wait days for a quote. Our valuation engine
                            compares thousands of market data points to give you the
                            best price instantly.
                        </p>

                        <ul className="mt-8 space-y-4">
                            {valuationPoints.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-3 font-medium text-foreground"
                                >
                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0 text-red-600"
                                        aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="#sell-car-form-section"
                            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-foreground px-8 py-4 font-bold text-background transition-colors hover:bg-foreground/90"
                        >
                            <span>Check Price Now</span>
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
