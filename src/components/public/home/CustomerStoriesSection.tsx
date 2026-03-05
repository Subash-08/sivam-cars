"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { MapPin, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PublicCustomerStory } from '@/services/public/home.service';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CustomerStoriesSectionProps {
    stories: PublicCustomerStory[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerStoriesSection({ stories }: CustomerStoriesSectionProps): React.JSX.Element | null {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (stories.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            // Scroll amount is roughly the width of one card plus the gap
            const scrollAmount = direction === 'left' ? -340 : 340;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative overflow-hidden bg-background py-10 md:py-12">
            {/* Subtle decorative background */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-primary/[0.02]" />

            <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                            Happy Customers
                        </span>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        SivamCars{' '}
                        <span className="relative inline-block text-primary">
                            Love Stories
                            {/* Changed the SVG text color to text-red-500 */}
                            <svg className="absolute -bottom-1 left-0 w-full text-red-500" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M2 6C50 2 150 2 198 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                            </svg>
                        </span>
                    </h2>
                    <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
                        Every car has a story. Every smile tells it best.
                    </p>
                </div>

                {/* Slider Section */}
                <div className="group/slider relative mt-12 sm:mt-16">
                    {/* Left Navigation Button */}
                    <button
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                        className="absolute -left-4 sm:-left-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-all hover:scale-105 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary xl:-left-12 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0"
                    >
                        <ChevronLeft className="h-6 w-6 text-foreground" />
                    </button>

                    {/* Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 pb-8 pt-4 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {stories.map((story) => (
                            <div
                                key={story._id}
                                className="group relative flex-none w-[280px] sm:w-[320px] snap-center overflow-hidden rounded-2xl border border-border/40 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30"
                            >
                                {/* Image */}
                                <div className="relative aspect-[3/4] w-full overflow-hidden">
                                    <Image
                                        src={story.imageUrl}
                                        alt={`${story.customerName} from ${story.location}`}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        sizes="(max-width: 640px) 280px, 320px"
                                        loading="lazy"
                                    />

                                    {/* Multi-layer gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                                    {/* Floating Glassmorphism Quote icon */}
                                    {story.testimonial && (
                                        <div className="absolute top-4 right-4 rounded-full border border-white/20 bg-white/10 p-2.5 backdrop-blur-md opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 -translate-y-4">
                                            <Quote className="h-4 w-4 text-white/90" />
                                        </div>
                                    )}

                                    {/* Text content on image */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        {story.testimonial && (
                                            <p className="mb-3 text-sm sm:text-base font-medium leading-relaxed text-white/90 drop-shadow-sm line-clamp-3 italic">
                                                &ldquo;{story.testimonial}&rdquo;
                                            </p>
                                        )}

                                        {/* Animated expanding separator line */}
                                        <div className="mb-3 h-[3px] w-8 rounded-full bg-primary transition-all duration-500 group-hover:w-full group-hover:bg-primary/80" />

                                        <h3 className="text-lg font-bold tracking-wide text-white">
                                            {story.customerName}
                                        </h3>
                                        <div className="mt-1.5 flex items-center gap-1.5">
                                            {/* Changed MapPin and text to red-500, reduced text size to text-xs */}
                                            <MapPin className="h-3.5 w-3.5 text-red-500" />
                                            <span className="text-xs font-medium text-red-500">
                                                {story.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Navigation Button */}
                    <button
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                        className="absolute -right-4 sm:-right-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-all hover:scale-105 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary xl:-right-12 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0"
                    >
                        <ChevronRight className="h-6 w-6 text-foreground" />
                    </button>
                </div>
            </div>
        </section>
    );
}