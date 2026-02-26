/**
 * /buy-cars — Public car listing page (Server Component).
 *
 * Architecture:
 *  - SSR only (no ISR)
 *  - Calls CarFilterService.getPublicListing() directly (Server Component → Service)
 *  - Passes serialized data to client components for interactivity
 *  - generateMetadata() for dynamic SEO
 *  - JSON-LD structured data (ItemList + BreadcrumbList)
 *  - Suspense boundary keyed to searchParams triggers skeleton on filter changes
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CarFilterService } from '@/services/filter/carFilter.service';
import { generateListingMetadata, generateListingJsonLd } from '@/lib/seo/listing-seo';
import type { ListingFilters, ListingSortOption } from '@/types/listing.types';
import { CarCard } from '@/components/public/listing/CarCard';
import { ActiveFilters } from '@/components/public/listing/ActiveFilters';
import { SortDropdown } from '@/components/public/listing/SortDropdown';
import { ListingPagination } from '@/components/public/listing/ListingPagination';
import { NoResults } from '@/components/public/listing/NoResults';
import { FilterSidebar } from '@/components/public/listing/FilterSidebar';
import { MobileFilterDrawer } from '@/components/public/listing/MobileFilterDrawer';
import { CarGridSkeleton } from '@/components/public/listing/CarCardSkeleton';

// ─── Service singleton (re-used across requests in the same process) ─────────

const filterService = new CarFilterService(/* includeInactive */ false);

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseSearchParams(raw: Record<string, string | string[] | undefined>): ListingFilters {
    const toNum = (v: string | string[] | undefined): number | undefined => {
        if (!v || Array.isArray(v)) return undefined;
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
    };
    const toArr = (v: string | string[] | undefined): string | string[] | undefined => v;

    return {
        page: toNum(raw.page),
        priceMin: toNum(raw.priceMin) ?? toNum(raw.minPrice),
        priceMax: toNum(raw.priceMax) ?? toNum(raw.maxPrice),
        brand: toArr(raw.brand),
        yearMin: toNum(raw.yearMin) ?? toNum(raw.minYear),
        yearMax: toNum(raw.yearMax) ?? toNum(raw.maxYear),
        kmsMax: toNum(raw.kmsMax) ?? toNum(raw.maxKms),
        fuel: toArr(raw.fuel) ?? toArr(raw.fuelType),
        bodyType: toArr(raw.bodyType),
        transmission: toArr(raw.transmission),
        sort: (['newest', 'price_asc', 'kms_asc'].includes(raw.sort as string)
            ? raw.sort
            : 'newest') as ListingSortOption,
    };
}

/** Count how many filter keys are active (for mobile badge). */
function countActiveFilters(raw: Record<string, string | string[] | undefined>): number {
    const filterKeys = ['priceMin', 'priceMax', 'brand', 'yearMin', 'yearMax', 'kmsMax', 'fuel', 'bodyType', 'transmission'];
    let count = 0;
    for (const key of filterKeys) {
        const val = raw[key];
        if (val) count += Array.isArray(val) ? val.length : 1;
    }
    return count;
}

/** Serialize searchParams into a stable string key for Suspense boundary. */
function buildSearchKey(raw: Record<string, string | string[] | undefined>): string {
    const sorted = Object.entries(raw)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${Array.isArray(v) ? v.sort().join(',') : v}`)
        .join('&');
    return sorted || '__default__';
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const raw = await searchParams;
    const brands = raw.brand ? (Array.isArray(raw.brand) ? raw.brand : [raw.brand]) : [];
    const result = await filterService.getPublicListing(parseSearchParams(raw));

    return generateListingMetadata({
        brands,
        priceMin: raw.priceMin ? Number(raw.priceMin) : undefined,
        priceMax: raw.priceMax ? Number(raw.priceMax) : undefined,
        total: result.pagination.total,
    });
}

// ─── Car Results (async Server Component — wrapped in Suspense) ──────────────

async function CarListingResults({
    filters,
}: {
    filters: ListingFilters;
}) {
    const result = await filterService.getPublicListing(filters);

    // Brand slug → name map for ActiveFilters chip labels
    const brandNames: Record<string, string> = {};
    result.filters.brands.forEach((b) => { brandNames[b.slug] = b.name; });

    if (result.cars.length === 0) {
        return <NoResults />;
    }

    return (
        <>
            {/* Car grid: 3 col desktop, 2 tablet, 1 mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {result.cars.map((car, i) => (
                    <CarCard
                        key={String(car._id)}
                        car={car}
                        priority={i < 3}
                    />
                ))}
            </div>

            {/* Pagination */}
            <Suspense>
                <ListingPagination pagination={result.pagination} />
            </Suspense>
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BuyCarsPage({ searchParams }: PageProps) {
    const raw = await searchParams;
    const filters = parseSearchParams(raw);
    const result = await filterService.getPublicListing(filters);
    const activeCount = countActiveFilters(raw);
    const searchKey = buildSearchKey(raw);

    // Brand slug → name map for ActiveFilters chip labels
    const brandNames: Record<string, string> = {};
    result.filters.brands.forEach((b) => { brandNames[b.slug] = b.name; });

    // JSON-LD
    const jsonLd = generateListingJsonLd({
        cars: result.cars,
        total: result.pagination.total,
        filters,
    });

    return (
        <>
            {/* Structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Buy Used Cars
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {result.pagination.total} car{result.pagination.total !== 1 ? 's' : ''} available
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Suspense>
                            <MobileFilterDrawer stats={result.filters} activeCount={activeCount} />
                            <SortDropdown currentSort={filters.sort ?? 'newest'} />
                        </Suspense>
                    </div>
                </div>

                {/* ── Active filter chips ─────────────────────────────────── */}
                {activeCount > 0 && (
                    <div className="mb-4">
                        <Suspense>
                            <ActiveFilters brandNames={brandNames} />
                        </Suspense>
                    </div>
                )}

                {/* ── Main layout: sidebar + grid ────────────────────────── */}
                <div className="flex gap-8">
                    {/* Sidebar — desktop only */}
                    <aside className="hidden lg:block w-[280px] flex-shrink-0">
                        <div className="sticky top-24">
                            <Suspense>
                                <FilterSidebar stats={result.filters} />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Main content area — Suspense keyed to searchParams for skeleton on filter change */}
                    <main className="flex-1 min-w-0">
                        <Suspense key={searchKey} fallback={<CarGridSkeleton />}>
                            <CarListingResults filters={filters} />
                        </Suspense>
                    </main>
                </div>
            </div>
        </>
    );
}
