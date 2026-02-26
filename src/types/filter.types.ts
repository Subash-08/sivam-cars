// ─── Enum Types ──────────────────────────────────────────────────────────────

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
export type Transmission = 'Manual' | 'Automatic' | 'CVT' | 'AMT';
export type BodyType =
    | 'SUV'
    | 'Sedan'
    | 'Hatchback'
    | 'Coupe'
    | 'Convertible'
    | 'MUV'
    | 'Pickup';

// ─── Filter Input ─────────────────────────────────────────────────────────────

export interface CarFilterParams {
    // Offset-based pagination (12 cars per page, max page 1000)
    page?: number;

    // Brand (accepts slug string or array of slugs)
    brand?: string | string[];

    // Price range (INR)
    minPrice?: number;
    maxPrice?: number;

    // Year range
    minYear?: number;
    maxYear?: number;

    // Exact / multi-select matches
    fuelType?: FuelType | FuelType[];
    transmission?: Transmission | Transmission[];
    bodyType?: BodyType | BodyType[];
    city?: string | string[];

    // Feature flags
    isFeatured?: boolean;
    /** Admin-only — only used when CarFilterService(includeInactive=true) */
    isSold?: boolean;

    // Sorting (whitelisted)
    sortBy?: 'price' | 'year' | 'kmsDriven' | 'createdAt';
    sortOrder?: 'asc' | 'desc';

    // Full-text search (requires text index on Car model)
    search?: string;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface PaginationMeta {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
}

export interface CarListResponse {
    cars: unknown[];
    pagination: PaginationMeta;
    appliedFilters: CarFilterParams;
    warnings?: string[];
}

// ─── Validation Constants (single source of truth) ───────────────────────────

export const FUEL_TYPES: FuelType[] = [
    'Petrol',
    'Diesel',
    'CNG',
    'Electric',
    'Hybrid',
];

export const TRANSMISSIONS: Transmission[] = [
    'Manual',
    'Automatic',
    'CVT',
    'AMT',
];

export const BODY_TYPES: BodyType[] = [
    'SUV',
    'Sedan',
    'Hatchback',
    'Coupe',
    'Convertible',
    'MUV',
    'Pickup',
];

export const SORT_FIELDS = ['price', 'year', 'kmsDriven', 'createdAt'] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;

export const PAGINATION_LIMIT = 12; // Fixed — never expose to client
export const PAGINATION_MAX_PAGE = 1000; // Guard against massive skip()
