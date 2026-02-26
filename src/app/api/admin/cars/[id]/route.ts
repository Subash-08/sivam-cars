import { type NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { CarAdminService } from '@/services/admin/carAdmin.service';
import { updateCarSchema } from '@/validations/admin/car.schema';

const carService = new CarAdminService();

// ─── GET /api/admin/cars/[id] ─────────────────────────────────────────────────

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();
        const car = await carService.getCarById(params.id);
        return NextResponse.json({ success: true, car });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[GET /api/admin/cars/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to fetch car';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}

// ─── PUT /api/admin/cars/[id] ─────────────────────────────────────────────────

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();

        const body = await request.json();

        // DEBUG — remove after confirming video persistence
        console.log('[PUT /api/admin/cars] body.sliderVideos:', JSON.stringify(body.sliderVideos));
        console.log('[PUT /api/admin/cars] body.reelVideos:', JSON.stringify(body.reelVideos));

        const validation = updateCarSchema.safeParse(body);

        if (!validation.success) {
            console.log('[PUT /api/admin/cars] Validation errors:', JSON.stringify(validation.error.issues));
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        // DEBUG — remove after confirming video persistence
        console.log('[PUT /api/admin/cars] validated.sliderVideos:', JSON.stringify(validation.data.sliderVideos));
        console.log('[PUT /api/admin/cars] validated.reelVideos:', JSON.stringify(validation.data.reelVideos));

        const car = await carService.updateCar(params.id, validation.data);
        return NextResponse.json({ success: true, car });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[PUT /api/admin/cars/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to update car';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}

// ─── DELETE /api/admin/cars/[id] ──────────────────────────────────────────────

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();

        const car = await carService.softDeleteCar(params.id);
        return NextResponse.json({ success: true, message: 'Car deleted', car });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[DELETE /api/admin/cars/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to delete car';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}

// ─── PATCH /api/admin/cars/[id] — toggle sold / featured ─────────────────────

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();

        const body = await request.json() as { action?: string };
        const action = body?.action;

        if (!['toggleSold', 'toggleFeatured'].includes(action ?? '')) {
            return NextResponse.json(
                { success: false, error: 'Invalid action. Use toggleSold or toggleFeatured' },
                { status: 400 },
            );
        }

        const car = action === 'toggleSold'
            ? await carService.toggleSold(params.id)
            : await carService.toggleFeatured(params.id);

        return NextResponse.json({ success: true, car });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[PATCH /api/admin/cars/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to update car';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}
