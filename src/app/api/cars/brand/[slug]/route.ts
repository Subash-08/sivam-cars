import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CarFilterService } from '@/services/filter/carFilter.service';

const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).max(1000).optional(),
    sortBy: z.enum(['price', 'year', 'kmsDriven', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    fuelType: z.union([z.string(), z.array(z.string())]).optional(),
    transmission: z.union([z.string(), z.array(z.string())]).optional(),
});

// ─── GET /api/cars/brand/[slug] ────────────────────────────────────────────────

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } },
) {
    try {
        const { slug } = params;

        if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
            return NextResponse.json(
                { success: false, error: 'Invalid brand slug' },
                { status: 400 },
            );
        }

        const sp = request.nextUrl.searchParams;

        const rawParams = {
            page: sp.get('page') ?? undefined,
            sortBy: sp.get('sortBy') ?? undefined,
            sortOrder: sp.get('sortOrder') ?? undefined,
            minPrice: sp.get('minPrice') ?? undefined,
            maxPrice: sp.get('maxPrice') ?? undefined,
            fuelType: sp.getAll('fuelType'),
            transmission: sp.getAll('transmission'),
        };

        const cleaned = Object.fromEntries(
            Object.entries(rawParams).filter(([, v]) =>
                v !== undefined && !(Array.isArray(v) && v.length === 0),
            ),
        );

        const parsed = paginationSchema.safeParse(cleaned);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: 'Invalid parameters', details: parsed.error.issues },
                { status: 400 },
            );
        }

        const filterService = new CarFilterService(false);
        const result = await filterService.getFilteredCars({
            ...parsed.data,
            fuelType: parsed.data.fuelType as any,
            transmission: parsed.data.transmission as any,
            brand: slug, // Slug passed directly — service resolves to ObjectId
        });

        return NextResponse.json({ success: true, brand: slug, ...result });
    } catch (error) {
        console.error(`[GET /api/cars/brand/${params?.slug}] Unhandled error:`, error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch brand cars' },
            { status: 500 },
        );
    }
}
