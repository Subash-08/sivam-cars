'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import type { FilterStats } from '@/types/listing.types';
import { FUEL_TYPES, TRANSMISSIONS, BODY_TYPES } from '@/types/filter.types';
import { useDebounce } from '@/hooks/useDebounce';
import { formatINR } from '@/lib/utils';

const MIN_PRICE = 50000;
const MAX_PRICE = 3000000;

interface FilterSidebarProps {
    stats: FilterStats;
}

export function FilterSidebar({ stats }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // ── Optimistic state for checkboxes ──────────────────────────────────────
    const [optimisticFilters, setOptimisticFilters] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const obj: Record<string, string[]> = {};
        Array.from(searchParams.keys()).forEach(k => {
            obj[k] = searchParams.getAll(k);
        });
        setOptimisticFilters(obj);
    }, [searchParams]);

    const isChecked = (key: string, value: string) => {
        return (optimisticFilters[key] || []).includes(value);
    };

    // ── Local state for debounced inputs ─────────────────────────────────────
    const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') ?? '');
    const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') ?? '');
    const [yearMin, setYearMin] = useState(searchParams.get('yearMin') ?? '');
    const [yearMax, setYearMax] = useState(searchParams.get('yearMax') ?? '');
    const [kmsMax, setKmsMax] = useState(searchParams.get('kmsMax') ?? '');
    const [brandSearch, setBrandSearch] = useState('');

    const dPriceMin = useDebounce(priceMin, 600);
    const dPriceMax = useDebounce(priceMax, 600);
    const dYearMin = useDebounce(yearMin, 600);
    const dYearMax = useDebounce(yearMax, 600);
    const dKmsMax = useDebounce(kmsMax, 600);

    // ── Sync debounced inputs → URL ─────────────────────────────────────────
    const pushRange = useCallback(
        (key: string, val: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (val) { params.set(key, val); } else { params.delete(key); }
            params.set('page', '1');
            startTransition(() => {
                router.push(`/buy-cars?${params.toString()}`, { scroll: false });
            });
        },
        [router, searchParams],
    );

    useEffect(() => { pushRange('priceMin', dPriceMin); }, [dPriceMin]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => { pushRange('priceMax', dPriceMax); }, [dPriceMax]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => { pushRange('yearMin', dYearMin); }, [dYearMin]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => { pushRange('yearMax', dYearMax); }, [dYearMax]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => { pushRange('kmsMax', dKmsMax); }, [dKmsMax]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Toggle checkbox filter ──────────────────────────────────────────────
    const toggleFilter = (key: string, value: string) => {
        // Optimistic UI update
        const current = optimisticFilters[key] || [];
        const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
        setOptimisticFilters(prev => ({ ...prev, [key]: next }));

        const params = new URLSearchParams(searchParams.toString());
        params.delete(key);
        next.forEach((v) => params.append(key, v));
        params.set('page', '1');

        startTransition(() => {
            router.push(`/buy-cars?${params.toString()}`, { scroll: false });
        });
    };

    // ── Build full option lists (all enums, with counts from stats) ─────────
    const statsCountMap = (arr: Array<{ value: string; count: number }>) => {
        const map: Record<string, number> = {};
        arr.forEach((item) => { map[item.value] = item.count; });
        return map;
    };

    const fuelCounts = statsCountMap(stats.fuelTypes);
    const bodyCounts = statsCountMap(stats.bodyTypes);
    const transCounts = statsCountMap(stats.transmissions);

    // Always show ALL enum values, with count (0 if none in inventory)
    const allFuelTypes = FUEL_TYPES.map((f) => ({ value: f, count: fuelCounts[f] ?? 0 }));
    const allBodyTypes = BODY_TYPES.map((b) => ({ value: b, count: bodyCounts[b] ?? 0 }));
    const allTransmissions = TRANSMISSIONS.map((t) => ({ value: t, count: transCounts[t] ?? 0 }));

    // ── Filter brands by search ─────────────────────────────────────────────
    const filteredBrands = stats.brands.filter((b) =>
        b.name.toLowerCase().includes(brandSearch.toLowerCase()),
    );

    const clearAll = () => {
        setPriceMin(''); setPriceMax('');
        setYearMin(''); setYearMax('');
        setKmsMax(''); setBrandSearch('');
        router.push('/buy-cars');
    };

    return (
        <div className={`bg-card border border-border rounded-xl p-5 space-y-6 transition-opacity duration-200 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">Filters</h2>
                <button onClick={clearAll} className="text-xs text-primary font-medium hover:underline">
                    Clear All
                </button>
            </div>

            {/* Price Range */}
            <Section title="Price Range">
                <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between text-sm font-medium text-foreground">
                        <span>{priceMin ? formatINR(Number(priceMin)) : formatINR(MIN_PRICE)}</span>
                        <span>{priceMax ? formatINR(Number(priceMax)) : formatINR(MAX_PRICE)}</span>
                    </div>

                    <div className="relative h-1.5 w-full bg-border rounded-full">
                        {/* Selected Track */}
                        <div
                            className="absolute h-full bg-primary rounded-full transition-all"
                            style={{
                                left: `${(() => {
                                    const val = Number(priceMin) || MIN_PRICE;
                                    return Math.max(0, ((val - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100);
                                })()}%`,
                                right: `${100 - (() => {
                                    const val = Number(priceMax) || MAX_PRICE;
                                    return Math.min(100, ((val - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100);
                                })()}%`
                            }}
                        />

                        {/* Min Thumb */}
                        <input
                            type="range"
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            step={50000}
                            value={priceMin || MIN_PRICE}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                const maxVal = Number(priceMax) || MAX_PRICE;
                                if (val <= maxVal) setPriceMin(e.target.value);
                            }}
                            className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-md z-10"
                        />
                        {/* Max Thumb */}
                        <input
                            type="range"
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            step={50000}
                            value={priceMax || MAX_PRICE}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                const minVal = Number(priceMin) || MIN_PRICE;
                                if (val >= minVal) setPriceMax(e.target.value);
                            }}
                            className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-md z-20"
                        />
                    </div>
                    <div className="flex justify-between items-center px-1 pt-1 opacity-50">
                        <span className="text-[10px] uppercase font-bold tracking-wider">Min</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider">Max</span>
                    </div>
                </div>
            </Section>

            {/* Brand */}
            <Section title="Brand">
                {stats.brands.length > 5 && (
                    <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search brands"
                            value={brandSearch}
                            onChange={(e) => setBrandSearch(e.target.value)}
                            className="w-full bg-input border border-border rounded-lg py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {brandSearch && (
                            <button onClick={() => setBrandSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>
                )}
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {filteredBrands.map((brand) => (
                        <CheckboxItem
                            key={brand._id}
                            label={brand.name}
                            count={brand.count}
                            checked={isChecked('brand', brand.slug)}
                            onChange={() => toggleFilter('brand', brand.slug)}
                        />
                    ))}
                    {filteredBrands.length === 0 && (
                        <p className="text-xs text-muted-foreground py-2">No brands found</p>
                    )}
                </div>
            </Section>

            {/* Year Range */}
            <Section title="Year">
                <div className="flex items-center gap-2">
                    <RangeInput placeholder={`Min ${stats.yearRange.min}`} value={yearMin} onChange={setYearMin} />
                    <span className="text-muted-foreground text-xs">–</span>
                    <RangeInput placeholder={`Max ${stats.yearRange.max}`} value={yearMax} onChange={setYearMax} />
                </div>
            </Section>

            {/* KM Driven */}
            <Section title="KM Driven (Max)">
                <RangeInput placeholder="e.g. 50000" value={kmsMax} onChange={setKmsMax} />
            </Section>

            {/* Fuel Type — always show ALL options */}
            <Section title="Fuel Type">
                <div className="space-y-1">
                    {allFuelTypes.map((f) => (
                        <CheckboxItem
                            key={f.value}
                            label={f.value}
                            count={f.count}
                            checked={isChecked('fuel', f.value)}
                            onChange={() => toggleFilter('fuel', f.value)}
                        />
                    ))}
                </div>
            </Section>

            {/* Body Type — always show ALL options */}
            <Section title="Body Type">
                <div className="space-y-1">
                    {allBodyTypes.map((b) => (
                        <CheckboxItem
                            key={b.value}
                            label={b.value}
                            count={b.count}
                            checked={isChecked('bodyType', b.value)}
                            onChange={() => toggleFilter('bodyType', b.value)}
                        />
                    ))}
                </div>
            </Section>

            {/* Transmission — always show ALL options */}
            <Section title="Transmission">
                <div className="space-y-1">
                    {allTransmissions.map((t) => (
                        <CheckboxItem
                            key={t.value}
                            label={t.value}
                            count={t.count}
                            checked={isChecked('transmission', t.value)}
                            onChange={() => toggleFilter('transmission', t.value)}
                        />
                    ))}
                </div>
            </Section>
        </div>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-sm font-medium text-foreground mb-2">{title}</h3>
            {children}
        </div>
    );
}

function CheckboxItem({
    label,
    count,
    checked,
    onChange,
}: {
    label: string;
    count: number;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <label className="flex items-center justify-between cursor-pointer group py-0.5">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="rounded border-border-strong text-primary focus:ring-ring w-3.5 h-3.5"
                />
                <span className={`text-sm transition-colors ${count === 0
                    ? 'text-muted-foreground'
                    : 'text-foreground group-hover:text-primary'
                    }`}>
                    {label}
                </span>
            </div>
            <span className={`text-[11px] tabular-nums ${count === 0 ? 'text-muted-foreground/50' : 'text-muted-foreground'
                }`}>
                ({count})
            </span>
        </label>
    );
}

function RangeInput({
    placeholder,
    value,
    onChange,
}: {
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <input
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-input border border-border rounded-lg py-1.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
    );
}
