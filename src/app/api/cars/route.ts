import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CarFilterService } from '@/services/filter/carFilter.service';

// ─── Zod Validation Schema ────────────────────────────────────────────────────
// Hard validation at the API boundary — service only receives clean data.

const filterSchema = z.object({
    page: z.coerce.number().int().min(1).max(1000).optional(),

    // Brand: supports ?brand=toyota&brand=honda (multiple values)
    brand: z.union([z.string(), z.array(z.string())]).optional(),

    // Price range
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),

    // Year range
    minYear: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
    maxYear: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),

    // Multi-select enum filters
    fuelType: z.union([z.string(), z.array(z.string())]).optional(),
    transmission: z.union([z.string(), z.array(z.string())]).optional(),
    bodyType: z.union([z.string(), z.array(z.string())]).optional(),
    city: z.union([z.string(), z.array(z.string())]).optional(),

    // Flags
    isFeatured: z.coerce.boolean().optional(),

    // Sorting (whitelisted enums)
    sortBy: z.enum(['price', 'year', 'kmsDriven', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),

    // Full-text search
    search: z.string().max(200).optional(),
});

// ─── GET /api/cars ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
    try {
        const sp = request.nextUrl.searchParams;

        /**
         * FIX: Do NOT use Object.fromEntries(sp) — it silently drops duplicate keys.
         * e.g. ?brand=toyota&brand=honda → { brand: 'honda' } (only last value kept)
         *
         * Instead, extract multi-value params with .getAll() and single-value
         * params with .get(), then merge into one object for Zod.
         */
        const rawParams = {
            page: sp.get('page') ?? undefined,
            brand: sp.getAll('brand'),      // maintains multi-value
            minPrice: sp.get('minPrice') ?? undefined,
            maxPrice: sp.get('maxPrice') ?? undefined,
            minYear: sp.get('minYear') ?? undefined,
            maxYear: sp.get('maxYear') ?? undefined,
            fuelType: sp.getAll('fuelType'),
            transmission: sp.getAll('transmission'),
            bodyType: sp.getAll('bodyType'),
            city: sp.getAll('city'),
            isFeatured: sp.get('isFeatured') ?? undefined,
            sortBy: sp.get('sortBy') ?? undefined,
            sortOrder: sp.get('sortOrder') ?? undefined,
            search: sp.get('search') ?? undefined,
        };

        // Strip empty arrays (no value provided for that filter)
        const cleaned = Object.fromEntries(
            Object.entries(rawParams).filter(([, v]) =>
                v !== undefined && !(Array.isArray(v) && v.length === 0),
            ),
        );

        // Zod hard validation
        const parsed = filterSchema.safeParse(cleaned);
        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid filter parameters',
                    details: parsed.error.issues,
                },
                { status: 400 },
            );
        }

        const filterService = new CarFilterService(false); // public view
        const result = await filterService.getFilteredCars(parsed.data as any);

        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error('[GET /api/cars] Unhandled error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch cars',
                cars: [],
                pagination: { total: 0, page: 1, totalPages: 0, hasNextPage: false },
            },
            { status: 500 },
        );
    }
}
