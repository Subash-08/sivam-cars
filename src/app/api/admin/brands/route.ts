import { type NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError } from '@/lib/adminGuard';
import { BrandAdminService } from '@/services/admin/brandAdmin.service';
import { createBrandSchema } from '@/validations/admin/brand.schema';

const brandService = new BrandAdminService();

// ─── GET /api/admin/brands ────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const sp = request.nextUrl.searchParams;
        const page = Math.max(1, Number(sp.get('page')) || 1);
        const includeDeleted = sp.get('includeDeleted') === 'true';

        const result = await brandService.getBrands(page, 20, includeDeleted);
        return NextResponse.json({ success: true, ...result });

    } catch (error) {
        if (isAuthError(error)) {
            return NextResponse.json({ success: false, error: error.message }, { status: error.status });
        }
        console.error('[GET /api/admin/brands]', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch brands' }, { status: 500 });
    }
}

// ─── POST /api/admin/brands ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = createBrandSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const brand = await brandService.createBrand(validation.data);
        return NextResponse.json({ success: true, brand }, { status: 201 });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json({ success: false, error: (error as Error).message }, { status: (error as { status: number }).status });
        }
        console.error('[POST /api/admin/brands]', error);
        const message = error instanceof Error ? error.message : 'Failed to create brand';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
