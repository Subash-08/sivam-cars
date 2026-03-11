'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { parseFiltersFromUrl, buildListingUrl } from '@/lib/listing.utils';

interface ActiveFiltersProps {
    brandNames: Record<string, string>;
}

export function ActiveFilters({ brandNames }: ActiveFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const allFilters = parseFiltersFromUrl(pathname, searchParams);

    const removeFilter = (key: string, value?: string) => {
        const nextFilters = { ...allFilters };

        if (value) {
            const current = nextFilters[key] || [];
            nextFilters[key] = current.filter((v) => v !== value);
        } else {
            delete nextFilters[key];
        }

        nextFilters.page = ['1'];
        router.push(buildListingUrl(nextFilters), { scroll: false });
    };

    const chips: Array<{ key: string; label: string; value?: string }> = [];

    // Brands
    (allFilters.brand || []).forEach((slug) => {
        chips.push({ key: 'brand', label: brandNames[slug] ?? slug, value: slug });
    });

    // Price
    const priceMin = allFilters.priceMin?.[0];
    const priceMax = allFilters.priceMax?.[0];
    if (priceMin || priceMax) {
        const label = priceMin && priceMax
            ? `₹${Number(priceMin).toLocaleString('en-IN')} – ₹${Number(priceMax).toLocaleString('en-IN')}`
            : priceMin
                ? `Min ₹${Number(priceMin).toLocaleString('en-IN')}`
                : `Max ₹${Number(priceMax).toLocaleString('en-IN')}`;
        chips.push({ key: 'priceMax', label }); // Use key priceMax to clear both if needed (or we can just leave it as price)
    }

    // Year
    const yearMin = allFilters.yearMin?.[0];
    const yearMax = allFilters.yearMax?.[0];
    if (yearMin || yearMax) {
        const label = yearMin && yearMax ? `${yearMin}–${yearMax}` : yearMin ? `${yearMin}+` : `Up to ${yearMax}`;
        chips.push({ key: 'yearMax', label });
    }

    // KMs
    const kmsMax = allFilters.kmsMax?.[0];
    if (kmsMax) {
        chips.push({ key: 'kmsMax', label: `Under ${Number(kmsMax).toLocaleString('en-IN')} km` });
    }

    // City
    (allFilters.city || []).forEach((v) => chips.push({ key: 'city', label: v, value: v }));

    // Enums
    (allFilters.fuel || []).forEach((v) => chips.push({ key: 'fuel', label: v, value: v }));
    (allFilters.bodyType || []).forEach((v) => chips.push({ key: 'bodyType', label: v, value: v }));
    (allFilters.transmission || []).forEach((v) => chips.push({ key: 'transmission', label: v, value: v }));

    if (chips.length === 0) return null;

    const clearAll = () => router.push('/used-cars');

    return (
        <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip, i) => (
                <span
                    key={`${chip.key}-${chip.value ?? i}`}
                    className="inline-flex items-center gap-1 bg-muted text-foreground px-3 py-1 rounded-full text-xs font-medium border border-border"
                >
                    {chip.label}
                    <button
                        onClick={() => {
                            if (chip.key === 'priceMax') {
                                removeFilter('priceMin');
                                removeFilter('priceMax');
                            } else if (chip.key === 'yearMax') {
                                removeFilter('yearMin');
                                removeFilter('yearMax');
                            } else {
                                removeFilter(chip.key, chip.value);
                            }
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Remove ${chip.label} filter`}
                    >
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
            <button
                onClick={clearAll}
                className="text-xs text-primary font-medium hover:underline ml-1"
            >
                Clear all
            </button>
        </div>
    );
}
