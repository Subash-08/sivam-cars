import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { HomepageBrand } from '@/services/public/home.service';

// ─── Component ────────────────────────────────────────────────────────────────

export default function PopularBrandsSection({ brands }: { brands: HomepageBrand[] }): React.JSX.Element | null {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="py-12 md:py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                        Explore Popular Brands
                    </h2>
                    <p className="mt-3 text-muted-foreground text-base sm:text-lg">
                        Browse our trusted selection from India&rsquo;s top car manufacturers
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {brands.map((brand) => (
                        <Link
                            key={brand._id}
                            href={`/used-cars?page=1&brand=${brand.slug}`}
                            className="group flex flex-col items-center justify-center gap-3 p-5 sm:p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40"
                        >
                            {/* Logo */}
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105">
                                {brand.logo ? (
                                    <Image
                                        src={brand.logo}
                                        alt={`${brand.name} logo`}
                                        fill
                                        className="object-contain"
                                        sizes="64px"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted rounded-full flex items-center justify-center text-xl font-bold text-muted-foreground">
                                        {brand.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <h3 className="font-semibold text-foreground text-sm sm:text-base text-center">
                                {brand.name}
                            </h3>

                            {/* Car Count */}
                            {/* <span className="text-xs font-medium text-primary">
                                {brand.carCount >= 10
                                    ? `${Math.floor(brand.carCount / 10) * 10}+ cars`
                                    : `${brand.carCount} car${brand.carCount !== 1 ? 's' : ''}`}
                            </span> */}
                        </Link>
                    ))}
                </div>

                {/* View All */}
                <div className="mt-8 text-center">
                    <Link
                        href="/used-cars"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline transition-colors"
                    >
                        View All Brands
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
