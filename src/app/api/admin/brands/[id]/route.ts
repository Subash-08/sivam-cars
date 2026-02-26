import { type NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError } from '@/lib/adminGuard';
import { BrandAdminService } from '@/services/admin/brandAdmin.service';
import { updateBrandSchema } from '@/validations/admin/brand.schema';

const brandService = new BrandAdminService();

// ─── PUT /api/admin/brands/[id] ───────────────────────────────────────────────

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = updateBrandSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const brand = await brandService.updateBrand(params.id, validation.data);
        return NextResponse.json({ success: true, brand });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json({ success: false, error: (error as Error).message }, { status: (error as { status: number }).status });
        }
        console.error(`[PUT /api/admin/brands/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to update brand';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}

// ─── DELETE /api/admin/brands/[id] ───────────────────────────────────────────

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();

        const brand = await brandService.softDeleteBrand(params.id);
        return NextResponse.json({ success: true, message: 'Brand deleted', brand });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json({ success: false, error: (error as Error).message }, { status: (error as { status: number }).status });
        }
        console.error(`[DELETE /api/admin/brands/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to delete brand';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}
