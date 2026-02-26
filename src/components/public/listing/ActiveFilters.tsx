'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
    brandNames: Record<string, string>;
}

export function ActiveFilters({ brandNames }: ActiveFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const removeFilter = (key: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            const current = params.getAll(key);
            params.delete(key);
            current.filter((v) => v !== value).forEach((v) => params.append(key, v));
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        router.push(`/buy-cars?${params.toString()}`, { scroll: false });
    };

    const chips: Array<{ key: string; label: string; value?: string }> = [];

    // Brands
    searchParams.getAll('brand').forEach((slug) => {
        chips.push({ key: 'brand', label: brandNames[slug] ?? slug, value: slug });
    });

    // Price
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    if (priceMin || priceMax) {
        const label = priceMin && priceMax
            ? `₹${Number(priceMin).toLocaleString('en-IN')} – ₹${Number(priceMax).toLocaleString('en-IN')}`
            : priceMin
                ? `Min ₹${Number(priceMin).toLocaleString('en-IN')}`
                : `Max ₹${Number(priceMax).toLocaleString('en-IN')}`;
        chips.push({ key: 'priceMin', label });
    }

    // Year
    const yearMin = searchParams.get('yearMin');
    const yearMax = searchParams.get('yearMax');
    if (yearMin || yearMax) {
        const label = yearMin && yearMax ? `${yearMin}–${yearMax}` : yearMin ? `${yearMin}+` : `Up to ${yearMax}`;
        chips.push({ key: 'yearMin', label });
    }

    // KMs
    const kmsMax = searchParams.get('kmsMax');
    if (kmsMax) {
        chips.push({ key: 'kmsMax', label: `Under ${Number(kmsMax).toLocaleString('en-IN')} km` });
    }

    // Enums
    searchParams.getAll('fuel').forEach((v) => chips.push({ key: 'fuel', label: v, value: v }));
    searchParams.getAll('bodyType').forEach((v) => chips.push({ key: 'bodyType', label: v, value: v }));
    searchParams.getAll('transmission').forEach((v) => chips.push({ key: 'transmission', label: v, value: v }));

    if (chips.length === 0) return null;

    const clearAll = () => router.push('/buy-cars');

    return (
        <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip, i) => (
                <span
                    key={`${chip.key}-${chip.value ?? i}`}
                    className="inline-flex items-center gap-1 bg-muted text-foreground px-3 py-1 rounded-full text-xs font-medium border border-border"
                >
                    {chip.label}
                    <button
                        onClick={() => removeFilter(chip.key, chip.value)}
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
