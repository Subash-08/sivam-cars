import { connectDB } from '@/lib/db';
import { Car, Brand } from '@/models';
import type { CarFilterParams, CarListResponse } from '@/types/filter.types';
import type { ListingFilters, ListingResult, FilterStats, ListingCar } from '@/types/listing.types';
import { LISTING_PAGE_SIZE } from '@/types/listing.types';
import {
    FUEL_TYPES,
    TRANSMISSIONS,
    BODY_TYPES,
    PAGINATION_LIMIT,
    PAGINATION_MAX_PAGE,
} from '@/types/filter.types';

// ─── Types ────────────────────────────────────────────────────────────────────

type SortDirection = 1 | -1;
type MongoSort = Record<string, SortDirection>;
type MongoQuery = Record<string, unknown>;

// Fields that support multi-value ($in) filtering
const ENUM_FIELDS = ['fuelType', 'transmission', 'bodyType'] as const;
const VALID_ENUM_VALUES: Record<string, readonly string[]> = {
    fuelType: FUEL_TYPES,
    transmission: TRANSMISSIONS,
    bodyType: BODY_TYPES,
};

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * CarFilterService — dynamic query builder for the car inventory.
 *
 * Architecture contract (from .ai/context.md):
 *  - Services call models directly — routes must NOT query models
 *  - All queries use .lean() for read-only operations
 *  - All list queries must be paginated (handled here)
 *  - Never expose raw errors to callers — log server-side, return safe result
 *
 * @param includeInactive — pass true in admin contexts to see soft-deleted cars
 */
export class CarFilterService {
    constructor(private readonly includeInactive = false) { }

    // ── Public API ──────────────────────────────────────────────────────────────

    async getFilteredCars(params: CarFilterParams): Promise<CarListResponse> {
        await connectDB();

        // Sanitize inputs — accumulate non-fatal warnings
        const { sanitized, warnings } = this.sanitize(params);

        // Resolve pagination — capped at PAGINATION_MAX_PAGE to prevent massive skip()
        const page = Math.min(PAGINATION_MAX_PAGE, Math.max(1, Number(sanitized.page) || 1));
        const limit = PAGINATION_LIMIT; // Fixed — never expose to client
        const skip = (page - 1) * limit;

        // Build sort (whitelisted)
        const sort = this.buildSort(sanitized.sortBy, sanitized.sortOrder);

        // Build dynamic query (may trigger brand slug resolution)
        let query: MongoQuery;
        try {
            query = await this.buildQuery(sanitized);
        } catch (error) {
            // Safe fallback: log the real error, return empty
            console.error('[CarFilterService.buildQuery] Error:', error);
            return this.emptyResponse(page, warnings);
        }

        try {
            // Parallel: car page + total count
            const [cars, total] = await Promise.all([
                Car.find(query)
                    .populate('brand', 'name slug logo')
                    .select(this.getListProjection())
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Car.countDocuments(query),
            ]);

            return {
                cars,
                pagination: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: skip + limit < total,
                },
                appliedFilters: sanitized,
                warnings: warnings.length > 0 ? warnings : undefined,
            };
        } catch (error) {
            console.error('[CarFilterService.getFilteredCars] DB error:', error);
            return this.emptyResponse(page, warnings);
        }
    }

    // ── Query Builder ───────────────────────────────────────────────────────────

    private async buildQuery(params: CarFilterParams): Promise<MongoQuery> {
        const query: MongoQuery = {};

        // Base: soft-delete + active status
        if (!this.includeInactive) {
            query.isActive = true;
            query.isDeleted = false;
        }

        // ── Brand (slug resolution → ObjectId) ──────────────────────────────────
        if (params.brand) {
            const brandIds = await this.resolveBrandSlugs(params.brand);
            if (brandIds.length === 0) {
                // Brand slug(s) don't exist → guarantee empty result set
                // Using a guaranteed-no-match condition instead of invalid ObjectId
                query['_id'] = { $exists: false };
                return query; // No need to process further filters
            }
            query['brand'] = { $in: brandIds };
        }

        // ── Price range ──────────────────────────────────────────────────────────
        // Fix: check !== undefined so price=0 is valid
        if (params.minPrice !== undefined || params.maxPrice !== undefined) {
            const priceRange: Record<string, number> = {};
            if (params.minPrice !== undefined) priceRange['$gte'] = params.minPrice;
            if (params.maxPrice !== undefined) priceRange['$lte'] = params.maxPrice;
            query['price'] = priceRange;
        }

        // ── Year range ───────────────────────────────────────────────────────────
        if (params.minYear !== undefined || params.maxYear !== undefined) {
            const yearRange: Record<string, number> = {};
            if (params.minYear !== undefined) yearRange['$gte'] = params.minYear;
            if (params.maxYear !== undefined) yearRange['$lte'] = params.maxYear;
            query['year'] = yearRange;
        }

        // ── Enum multi-select filters ─────────────────────────────────────────────
        for (const field of ENUM_FIELDS) {
            const value = params[field];
            if (!value) continue;

            const values = Array.isArray(value) ? value : [value];
            const validValues = values.filter((v) =>
                (VALID_ENUM_VALUES[field] as readonly string[]).includes(v),
            );

            if (validValues.length === 0) {
                // All values were invalid → no results possible
                query['_id'] = { $exists: false };
                return query;
            }

            query[field] = validValues.length === 1
                ? validValues[0]   // Single value → exact match (more index-friendly)
                : { $in: validValues };
        }

        // ── City (non-enum string, allow any value) ───────────────────────────────
        if (params.city) {
            const cities = Array.isArray(params.city) ? params.city : [params.city];
            const trimmed = cities.map((c) => c.trim()).filter(Boolean);
            if (trimmed.length > 0) {
                query['location.city'] = trimmed.length === 1
                    ? trimmed[0]
                    : { $in: trimmed };
            }
        }

        // ── Featured flag ─────────────────────────────────────────────────────────
        if (params.isFeatured !== undefined) {
            query['isFeatured'] = params.isFeatured;
        }

        // ── Sold flag (admin only) ────────────────────────────────────────────────
        if (params.isSold !== undefined && this.includeInactive) {
            query['isSold'] = params.isSold;
        }

        // ── Full-text search (requires text index on Car model) ───────────────────
        if (params.search?.trim()) {
            query['$text'] = { $search: params.search.trim() };
        }

        return query;
    }

    // ── Brand Slug Resolution ───────────────────────────────────────────────────

    /**
     * Converts brand slugs → ObjectIds.
     * Returns empty array if no matching active brand is found.
     * This triggers a 2nd DB hit — acceptable at current scale.
     * At 10k+ cars: consider denormalizing brandSlug onto Car document.
     */
    private async resolveBrandSlugs(brandInput: string | string[]): Promise<string[]> {
        const slugs = Array.isArray(brandInput) ? brandInput : [brandInput];
        const cleanSlugs = slugs.map((s) => s.toLowerCase().trim()).filter(Boolean);

        if (cleanSlugs.length === 0) return [];

        const brands = await Brand.find({
            slug: { $in: cleanSlugs },
            isActive: true,
            isDeleted: false,
        })
            .select('_id')
            .lean();

        return brands.map((b) => (b._id as { toString(): string }).toString());
    }

    // ── Sort Builder ────────────────────────────────────────────────────────────

    private buildSort(sortBy?: string, sortOrder?: string): MongoSort {
        const order: SortDirection = sortOrder === 'asc' ? 1 : -1;
        const allowed: Record<string, MongoSort> = {
            price: { price: order },
            year: { year: order },
            kmsDriven: { kmsDriven: order },
            createdAt: { createdAt: order },
        };
        // Default: newest first
        return allowed[sortBy ?? ''] ?? { createdAt: -1 };
    }

    // ── Input Sanitization ──────────────────────────────────────────────────────

    /**
     * Sanitizes inputs, swaps inverted ranges, clamps year bounds.
     * Never rejects valid input — accumulates warnings instead.
     * Hard validation (Zod schema) happens at the route handler level.
     */
    private sanitize(raw: CarFilterParams): {
        sanitized: CarFilterParams;
        warnings: string[];
    } {
        const warnings: string[] = [];
        const s: CarFilterParams = { ...raw };

        const currentYear = new Date().getFullYear();

        // Swap inverted price range
        if (s.minPrice !== undefined && s.maxPrice !== undefined && s.minPrice > s.maxPrice) {
            [s.minPrice, s.maxPrice] = [s.maxPrice, s.minPrice];
            warnings.push('minPrice was greater than maxPrice — values have been swapped.');
        }

        // Swap inverted year range
        if (s.minYear !== undefined && s.maxYear !== undefined && s.minYear > s.maxYear) {
            [s.minYear, s.maxYear] = [s.maxYear, s.minYear];
            warnings.push('minYear was greater than maxYear — values have been swapped.');
        }

        // Clamp year bounds
        if (s.minYear !== undefined) {
            s.minYear = Math.max(1900, Math.min(s.minYear, currentYear));
        }
        if (s.maxYear !== undefined) {
            s.maxYear = Math.max(1900, Math.min(s.maxYear, currentYear));
        }

        // Ensure price is non-negative
        if (s.minPrice !== undefined && s.minPrice < 0) {
            s.minPrice = 0;
            warnings.push('minPrice was negative — clamped to 0.');
        }

        return { sanitized: s, warnings };
    }

    // ── Projection (listing view — never return full document) ──────────────────

    private getListProjection() {
        // Only fields needed for a car card in the listing grid.
        // Intentionally excludes: dynamic sections, full description, all images, SEO fields, audit.
        return {
            name: 1,
            slug: 1,
            price: 1,
            year: 1,
            kmsDriven: 1,
            fuelType: 1,
            transmission: 1,
            bodyType: 1,
            color: 1,
            numberOfOwners: 1,
            location: 1,
            isFeatured: 1,
            isSold: 1,
            brand: 1,
            createdAt: 1,
            // First image only for listing thumbnail
            images: { $slice: ['$images', 1] },
        };
    }

    // ── Empty result helper ─────────────────────────────────────────────────────

    private emptyResponse(page: number, warnings: string[]): CarListResponse {
        return {
            cars: [],
            pagination: { total: 0, page, totalPages: 0, hasNextPage: false },
            appliedFilters: {},
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    }

    // ── Public Listing API (used by /buy-cars page) ─────────────────────────────

    /**
     * Fetches cars for the public listing page.
     * Enforces:
     *  - isActive: true, isDeleted: false, isSold: false
     *  - 9 cars per page (LISTING_PAGE_SIZE)
     *  - Parallel: filtered cars + total count + filter stats
     */
    async getPublicListing(filters: ListingFilters): Promise<ListingResult> {
        await connectDB();

        // Map ListingFilters → CarFilterParams with public-safe defaults
        const params: CarFilterParams = {
            page: filters.page,
            brand: filters.brand,
            minPrice: filters.priceMin,
            maxPrice: filters.priceMax,
            minYear: filters.yearMin,
            maxYear: filters.yearMax,
            fuelType: filters.fuel as CarFilterParams['fuelType'],
            bodyType: filters.bodyType as CarFilterParams['bodyType'],
            transmission: filters.transmission as CarFilterParams['transmission'],
            isSold: false, // Never show sold cars on public listing
        };

        // Max KMs
        // CarFilterParams doesn't have kmsMax, so we handle it in the query directly.

        // Sanitize
        const { sanitized, warnings: _warnings } = this.sanitize(params);

        // Build sort
        const sortMap: Record<string, MongoSort> = {
            newest: { createdAt: -1 },
            price_asc: { price: 1 },
            kms_asc: { kmsDriven: 1 },
        };
        const sort = sortMap[filters.sort ?? 'newest'] ?? { createdAt: -1 };

        // Pagination
        const page = Math.min(PAGINATION_MAX_PAGE, Math.max(1, Number(sanitized.page) || 1));
        const limit = LISTING_PAGE_SIZE;
        const skip = (page - 1) * limit;

        // Build query
        let query: MongoQuery;
        try {
            query = await this.buildQuery(sanitized);
        } catch (error) {
            console.error('[CarFilterService.getPublicListing] buildQuery error:', error);
            return this.emptyListingResult(page);
        }

        // Force public-safe base filters
        query.isActive = true;
        query.isDeleted = false;
        query.isSold = false;

        // Add kmsMax if provided
        if (filters.kmsMax !== undefined && filters.kmsMax > 0) {
            query.kmsDriven = { ...(query.kmsDriven as Record<string, unknown> ?? {}), $lte: filters.kmsMax };
        }

        try {
            const baseQuery: MongoQuery = { isActive: true, isDeleted: false, isSold: false };

            const [cars, total, filterStats] = await Promise.all([
                Car.find(query)
                    .populate('brand', 'name slug')
                    .select(this.getListProjection())
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Car.countDocuments(query),
                this.getFilterStats(baseQuery),
            ]);

            return {
                cars: cars as unknown as ListingCar[],
                pagination: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                    hasNext: skip + limit < total,
                    hasPrev: page > 1,
                },
                filters: filterStats,
            };
        } catch (error) {
            console.error('[CarFilterService.getPublicListing] DB error:', error);
            return this.emptyListingResult(page);
        }
    }

    // ── Filter Stats Aggregation (for sidebar counts) ────────────────────────────

    /**
     * Computes available filter options and counts from the
     * entire active+unsold inventory. Run against the base query
     * (not user's filtered query) so the sidebar always shows all options.
     */
    async getFilterStats(baseQuery: MongoQuery): Promise<FilterStats> {
        try {
            const [brandAgg, fuelAgg, bodyAgg, transAgg, priceAgg, yearAgg] = await Promise.all([
                Car.aggregate([
                    { $match: baseQuery },
                    { $group: { _id: '$brand', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                ]),
                Car.aggregate([
                    { $match: baseQuery },
                    { $group: { _id: '$fuelType', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                ]),
                Car.aggregate([
                    { $match: baseQuery },
                    { $group: { _id: '$bodyType', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                ]),
                Car.aggregate([
                    { $match: baseQuery },
                    { $group: { _id: '$transmission', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                ]),
                Car.aggregate([
                    { $match: baseQuery },
                    { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
                ]),
                Car.aggregate([
                    { $match: baseQuery },
                    { $group: { _id: null, min: { $min: '$year' }, max: { $max: '$year' } } },
                ]),
            ]);

            // Resolve brand names
            const brandIds = brandAgg.map((b: { _id: unknown }) => b._id);
            const brandDocs = await Brand.find({ _id: { $in: brandIds } })
                .select('name slug')
                .lean();

            const brands = brandAgg.map((b: { _id: unknown; count: number }) => {
                const doc = brandDocs.find(
                    (d) => String(d._id) === String(b._id),
                );
                return {
                    _id: String(b._id),
                    name: doc?.name ?? 'Unknown',
                    slug: doc?.slug ?? '',
                    count: b.count,
                };
            });

            return {
                brands,
                fuelTypes: fuelAgg.map((f: { _id: string; count: number }) => ({ value: f._id, count: f.count })),
                bodyTypes: bodyAgg.map((b: { _id: string; count: number }) => ({ value: b._id, count: b.count })),
                transmissions: transAgg.map((t: { _id: string; count: number }) => ({ value: t._id, count: t.count })),
                priceRange: {
                    min: (priceAgg[0] as { min?: number } | undefined)?.min ?? 0,
                    max: (priceAgg[0] as { max?: number } | undefined)?.max ?? 10_000_000,
                },
                yearRange: {
                    min: (yearAgg[0] as { min?: number } | undefined)?.min ?? 2000,
                    max: (yearAgg[0] as { max?: number } | undefined)?.max ?? new Date().getFullYear(),
                },
            };
        } catch (error) {
            console.error('[CarFilterService.getFilterStats] error:', error);
            return {
                brands: [],
                fuelTypes: [],
                bodyTypes: [],
                transmissions: [],
                priceRange: { min: 0, max: 10_000_000 },
                yearRange: { min: 2000, max: new Date().getFullYear() },
            };
        }
    }

    private emptyListingResult(page: number): ListingResult {
        return {
            cars: [],
            pagination: { total: 0, page, totalPages: 0, hasNext: false, hasPrev: page > 1 },
            filters: {
                brands: [],
                fuelTypes: [],
                bodyTypes: [],
                transmissions: [],
                priceRange: { min: 0, max: 10_000_000 },
                yearRange: { min: 2000, max: new Date().getFullYear() },
            },
        };
    }
}
