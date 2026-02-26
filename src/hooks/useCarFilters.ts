'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { CarFilterParams } from '@/types/filter.types';

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useCarFilters — URL-driven filter state for the car listing page.
 *
 * Design principles:
 * - URL = single source of truth (SSR-friendly)
 * - Multi-value params use repeated keys: ?fuelType=Petrol&fuelType=Diesel
 * - Updating filters resets to page 1 (except explicit page updates)
 * - FIX: minPrice=0 is preserved (explicit null check, not falsy check)
 */
export function useCarFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    // ─── Derive current filter state from URL ─────────────────────────────────

    const filters = useMemo((): CarFilterParams => {
        // FIX: Use explicit null check for numeric params to preserve value=0
        const getNum = (key: string): number | undefined => {
            const raw = sp.get(key);
            return raw !== null ? Number(raw) : undefined;
        };

        return {
            page: Math.max(1, Number(sp.get('page')) || 1),
            brand: sp.getAll('brand'),        // multi-value
            minPrice: getNum('minPrice'),         // FIX: 0 preserved
            maxPrice: getNum('maxPrice'),
            minYear: getNum('minYear'),
            maxYear: getNum('maxYear'),
            fuelType: sp.getAll('fuelType') as CarFilterParams['fuelType'],
            transmission: sp.getAll('transmission') as CarFilterParams['transmission'],
            bodyType: sp.getAll('bodyType') as CarFilterParams['bodyType'],
            city: sp.getAll('city'),
            sortBy: (sp.get('sortBy') ?? 'createdAt') as CarFilterParams['sortBy'],
            sortOrder: (sp.get('sortOrder') ?? 'desc') as CarFilterParams['sortOrder'],
            search: sp.get('search') ?? undefined,
            isFeatured: sp.get('isFeatured') === 'true' ? true : undefined,
        };
    }, [sp]);

    // ─── Update filters → push to URL ────────────────────────────────────────

    const updateFilters = useCallback(
        (updates: Partial<CarFilterParams>) => {
            const params = new URLSearchParams(sp.toString());

            Object.entries(updates).forEach(([key, value]) => {
                // Remove existing values for this key first
                params.delete(key);

                if (Array.isArray(value)) {
                    // Multi-value: append each separately (?brand=toyota&brand=honda)
                    value.forEach((v) => {
                        if (v !== undefined && v !== '') params.append(key, String(v));
                    });
                } else if (value !== undefined && value !== '') {
                    params.set(key, String(value));
                }
                // undefined / empty string → key is removed (already deleted above)
            });

            // Reset to page 1 when any filter other than page itself changes
            if (!('page' in updates)) {
                params.set('page', '1');
            }

            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [router, pathname, sp],
    );

    // ─── Convenience helpers ──────────────────────────────────────────────────

    const clearFilters = useCallback(() => {
        router.push(pathname, { scroll: false });
    }, [router, pathname]);

    const setPage = useCallback(
        (page: number) => {
            updateFilters({ page });
        },
        [updateFilters],
    );

    const toggleArrayFilter = useCallback(
        (key: keyof CarFilterParams, value: string) => {
            const current = sp.getAll(key as string);
            const next = current.includes(value)
                ? current.filter((v) => v !== value) // remove
                : [...current, value];               // add
            updateFilters({ [key]: next });
        },
        [sp, updateFilters],
    );

    const hasFilters = useMemo(
        () => sp.size > 0 && !(sp.size === 1 && sp.has('page')),
        [sp],
    );

    return {
        filters,
        updateFilters,
        clearFilters,
        setPage,
        toggleArrayFilter,
        hasFilters,
    };
}
