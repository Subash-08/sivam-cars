import { Suspense } from 'react';
import { CarFilterService } from '@/services/filter/carFilter.service';
import { generateListingJsonLd } from '@/lib/seo/listing-seo';
import type { ListingFilters } from '@/types/listing.types';
import { parseSearchParams, buildSearchKey } from '@/lib/listing.utils';
import { CarCard } from '@/components/public/listing/CarCard';
import { ActiveFilters } from '@/components/public/listing/ActiveFilters';
import { SortDropdown } from '@/components/public/listing/SortDropdown';
import { ListingPagination } from '@/components/public/listing/ListingPagination';
import { NoResults } from '@/components/public/listing/NoResults';
import { FilterSidebar } from '@/components/public/listing/FilterSidebar';
import { MobileFilterDrawer } from '@/components/public/listing/MobileFilterDrawer';
import { CarGridSkeleton } from '@/components/public/listing/CarCardSkeleton';

const filterService = new CarFilterService(false);

// ─── Car Results (async Server Component — wrapped in Suspense) ──────────────

async function CarListingResults({
    filters,
}: {
    filters: ListingFilters;
}) {
    const result = await filterService.getPublicListing(filters);

    if (result.cars.length === 0) {
        return <NoResults />;
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {result.cars.map((car, i) => (
                    <CarCard
                        key={String(car._id)}
                        car={car}
                        priority={i < 3}
                    />
                ))}
            </div>

            <Suspense>
                <ListingPagination pagination={result.pagination} />
            </Suspense>
        </>
    );
}

// ─── Shared Layout ────────────────────────────────────────────────────────────

export interface SharedListingLayoutProps {
    searchParams: Record<string, string | string[] | undefined>;
    filterOverrides?: Partial<ListingFilters>;
    title?: string;
    subtitle?: string;
    footerContent?: React.ReactNode;
    additionalJsonLd?: object[];
}

export async function SharedListingLayout({
    searchParams,
    filterOverrides,
    title = 'Buy Used Cars',
    subtitle,
    footerContent,
    additionalJsonLd = [],
}: SharedListingLayoutProps) {
    const filters = parseSearchParams(searchParams, filterOverrides);

    // activeCount should count actual applied filters, including overrides.
    // parseSearchParams outputs arrays/numbers/strings. 
    // Exclude 'page' and 'sort' from the filter active count.
    let activeCount = 0;
    const excludeKeys = ['page', 'sort'];
    Object.entries(filters).forEach(([k, v]) => {
        if (!excludeKeys.includes(k) && v !== undefined && v !== null) {
            if (Array.isArray(v)) {
                activeCount += v.length;
            } else if (v !== '') {
                activeCount += 1;
            }
        }
    });

    const result = await filterService.getPublicListing(filters);
    const searchKey = buildSearchKey(searchParams);

    // Brand slug → name map for ActiveFilters chip labels
    const brandNames: Record<string, string> = {};
    result.filters.brands.forEach((b) => { brandNames[b.slug] = b.name; });

    // Base JSON-LD ItemList
    const jsonLd = generateListingJsonLd({
        cars: result.cars,
        total: result.pagination.total,
        filters,
    });

    // Combine base with any additional injected schema
    const combinedSchema = [...jsonLd, ...additionalJsonLd];

    const displaySubtitle = subtitle ?? `${result.pagination.total} car${result.pagination.total !== 1 ? 's' : ''} available`;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {displaySubtitle}
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

                    {/* Main content area */}
                    <main className="flex-1 min-w-0">
                        <Suspense key={searchKey} fallback={<CarGridSkeleton />}>
                            <CarListingResults filters={filters} />
                        </Suspense>

                        {/* SEO Content Injection Point */}
                        {footerContent && (
                            <div className="mt-16">
                                {footerContent}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}
