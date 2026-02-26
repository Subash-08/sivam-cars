/**
 * src/types/listing.types.ts — Public car listing types.
 *
 * Kept separate from admin types. Used by the public /buy-cars page,
 * CarFilterService.getPublicListing(), and listing components.
 */

import type { FuelType, Transmission, BodyType } from '@/types/filter.types';

// ─── Listing page size ────────────────────────────────────────────────────────

export const LISTING_PAGE_SIZE = 9;

// ─── Sort options ─────────────────────────────────────────────────────────────

export type ListingSortOption = 'newest' | 'price_asc' | 'kms_asc';

export const LISTING_SORT_OPTIONS: ReadonlyArray<{
    value: ListingSortOption;
    label: string;
}> = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'kms_asc', label: 'Lowest KM' },
] as const;

// ─── Listing filters (URL query params) ──────────────────────────────────────

export interface ListingFilters {
    page?: number;
    priceMin?: number;
    priceMax?: number;
    brand?: string | string[];
    yearMin?: number;
    yearMax?: number;
    kmsMax?: number;
    fuel?: string | string[];
    bodyType?: string | string[];
    transmission?: string | string[];
    sort?: ListingSortOption;
}

// ─── Listing car (slim projection for card) ──────────────────────────────────

export interface ListingCar {
    _id: string;
    name: string;
    slug: string;
    price: number;
    year: number;
    kmsDriven: number;
    fuelType: FuelType;
    transmission: Transmission;
    bodyType: BodyType;
    images: Array<{ url: string; isPrimary?: boolean }>;
    brand: { _id: string; name: string; slug: string };
    isFeatured: boolean;
    location: { city: string; state: string };
    createdAt: string;
}

// ─── Filter sidebar stats ────────────────────────────────────────────────────

export interface FilterStats {
    brands: Array<{ _id: string; name: string; slug: string; count: number }>;
    fuelTypes: Array<{ value: string; count: number }>;
    bodyTypes: Array<{ value: string; count: number }>;
    transmissions: Array<{ value: string; count: number }>;
    priceRange: { min: number; max: number };
    yearRange: { min: number; max: number };
}

// ─── Full listing result ─────────────────────────────────────────────────────

export interface ListingResult {
    cars: ListingCar[];
    pagination: {
        total: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    filters: FilterStats;
}
