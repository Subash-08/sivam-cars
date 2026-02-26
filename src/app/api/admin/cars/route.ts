import { type NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { CarAdminService, type AdminCarFilters } from '@/services/admin/carAdmin.service';
import { createCarSchema } from '@/validations/admin/car.schema';

const carService = new CarAdminService();

// ─── GET /api/admin/cars ──────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        /**
         * FIX: Do NOT use Object.fromEntries — even for admin, avoid the regression.
         * Parse each param explicitly with type coercion.
         */
        const sp = request.nextUrl.searchParams;

        const filters: AdminCarFilters = {
            page: Math.max(1, Number(sp.get('page')) || 1),
            brand: sp.get('brand') ?? undefined,
            search: sp.get('search') ?? undefined,
            excludeId: sp.get('excludeId') ?? undefined,
            includeDeleted: sp.get('includeDeleted') === 'true',
        };

        // Boolean flags — only set if explicitly provided
        const isSold = sp.get('isSold');
        const isFeatured = sp.get('isFeatured');
        const isActive = sp.get('isActive');

        if (isSold !== null) filters.isSold = isSold === 'true';
        if (isFeatured !== null) filters.isFeatured = isFeatured === 'true';
        if (isActive !== null) filters.isActive = isActive === 'true';

        const result = await carService.getCarsForAdmin(filters);
        return NextResponse.json({ success: true, ...result });

    } catch (error) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[GET /api/admin/cars]', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch cars' }, { status: 500 });
    }
}

// ─── POST /api/admin/cars ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = createCarSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const car = await carService.createCar(validation.data);
        return NextResponse.json({ success: true, car }, { status: 201 });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[POST /api/admin/cars]', error);
        const message = error instanceof Error ? error.message : 'Failed to create car';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
