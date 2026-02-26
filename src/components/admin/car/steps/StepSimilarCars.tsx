'use client';

import { useEffect, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';

interface CarOption {
    _id: string;
    name: string;
    year: number;
    price: number;
    images: Array<{ url: string; isPrimary?: boolean }>;
    brand: { name: string };
}

interface StepSimilarCarsProps {
    /** In edit mode — exclude self from the search results (server-enforced) */
    currentCarId?: string;
}

export function StepSimilarCars({ currentCarId }: StepSimilarCarsProps) {
    const { watch, setValue } = useFormContext();
    const [search, setSearch] = useState('');
    const [cars, setCars] = useState<CarOption[]>([]);
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebounce(search, 400);
    const selectedIds: string[] = watch('similarCars') ?? [];

    // ── Fetch (server-side excludeId — critique fix #2) ─────────────────────────

    const fetchCars = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ limit: '20' });
            if (debouncedSearch) params.set('search', debouncedSearch);
            if (currentCarId) params.set('excludeId', currentCarId); // server-side exclusion

            const res = await fetch(`/api/admin/cars?${params.toString()}`);
            const data = await res.json();
            if (data.success) setCars(data.cars ?? []);
        } catch { /* handled at page level */ }
        finally { setLoading(false); }
    }, [debouncedSearch, currentCarId]);

    useEffect(() => { void fetchCars(); }, [fetchCars]);

    // ── Toggle selection ────────────────────────────────────────────────────────

    const toggle = useCallback((carId: string) => {
        const current = selectedIds;
        const next = current.includes(carId)
            ? current.filter((id) => id !== carId)
            : [...current, carId].slice(0, 10); // max 10

        setValue('similarCars', next, { shouldValidate: true });
    }, [selectedIds, setValue]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-foreground">Similar Cars</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Select up to 10 similar cars.
                    {currentCarId && ' Current car is excluded.'}
                </p>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <Input placeholder="Search by name or brand…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>

            {/* Selected chips */}
            {selectedIds.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-xs font-semibold text-primary mb-2">
                        Selected ({selectedIds.length}/10)
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {selectedIds.map((id) => {
                            const car = cars.find((c) => c._id === id);
                            return (
                                <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border text-sm">
                                    {car ? `${car.name} (${car.year})` : id.slice(-6)}
                                    <button type="button" onClick={() => toggle(id)} className="text-muted-foreground hover:text-destructive">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Car grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {loading ? (
                    <div className="col-span-full text-center py-10 text-muted-foreground text-sm">Loading…</div>
                ) : cars.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-muted-foreground text-sm">No cars found.</div>
                ) : (
                    cars.map((car) => {
                        const isSelected = selectedIds.includes(car._id);
                        const thumb = car.images?.find((i) => i.isPrimary) ?? car.images?.[0];

                        return (
                            <button
                                key={car._id}
                                type="button"
                                onClick={() => toggle(car._id)}
                                disabled={selectedIds.length >= 10 && !isSelected}
                                className={`
                  flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
                  ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-border-strong'}
                  ${selectedIds.length >= 10 && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}
                `}
                            >
                                <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    {thumb?.url ? (
                                        <Image src={thumb.url} alt={car.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">No img</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{car.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {car.brand?.name} · {car.year} · ₹{car.price?.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                {isSelected && (
                                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
