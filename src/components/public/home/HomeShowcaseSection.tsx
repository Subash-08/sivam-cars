import Link from 'next/link';
import { CarCard } from '@/components/public/listing/CarCard';
import type { ListingCar } from '@/types/listing.types';
import type { LayoutType } from '@/models';

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeShowcaseSectionProps {
    title: string;
    subtitle?: string;
    layoutType: LayoutType;
    viewAllText?: string;
    viewAllLink?: string;
    cars: ListingCar[];
    /** Mark first N images as priority (above-the-fold) */
    priorityImages?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeShowcaseSection({
    title,
    subtitle,
    layoutType,
    viewAllText,
    viewAllLink,
    cars,
    priorityImages = false,
}: HomeShowcaseSectionProps) {
    if (!cars || cars.length === 0) return null;

    return (
        <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Header Row ──────────────────────────────────────────── */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
                        {subtitle && (
                            <p className="mt-2 text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                    {viewAllText && viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="hidden sm:inline-flex text-primary font-semibold hover:text-primary-hover transition-colors items-center gap-1"
                        >
                            {viewAllText}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </Link>
                    )}
                </div>

                {/* ── Layout ─────────────────────────────────────────────── */}
                {layoutType === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((car, idx) => (
                            <CarCard key={car._id} car={car} priority={priorityImages && idx < 3} />
                        ))}
                    </div>
                )}

                {layoutType === 'carousel' && (
                    <div className="relative group/carousel">
                        {/* Hiding scrollbar natively across all browsers */}
                        <div className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {cars.map((car, idx) => (
                                <div
                                    key={car._id}
                                    className="snap-start shrink-0 w-[300px] sm:w-[340px] lg:w-[370px]"
                                >
                                    <CarCard car={car} priority={priorityImages && idx < 3} />
                                </div>
                            ))}
                        </div>
                        {/* Scroll hint gradient */}
                        <div className="absolute top-0 right-0 bottom-4 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                    </div>
                )}

                {layoutType === 'horizontal-scroll' && (
                    /* Hiding scrollbar natively across all browsers */
                    <div className="flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {cars.map((car, idx) => (
                            <div
                                key={car._id}
                                className="shrink-0 w-[300px] sm:w-[340px] lg:w-[370px] "
                            >
                                <CarCard car={car} priority={priorityImages && idx < 3} />
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Mobile View All button ──────────────────────────────── */}
                {viewAllText && viewAllLink && (
                    <div className="mt-8 text-center sm:hidden">
                        <Link
                            href={viewAllLink}
                            className="inline-flex w-full justify-center items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold px-6 py-3 rounded-lg transition-all"
                        >
                            {viewAllText}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}