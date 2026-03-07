import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { CustomerStoryAdminService } from '@/services/admin/customerStoryAdmin.service';
import { updateCustomerStorySchema } from '@/validations/admin/customerStory.schema';

const storyService = new CustomerStoryAdminService();

// ─── GET /api/admin/customer-stories/[id] ─────────────────────────────────────

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();
        const story = await storyService.getById(params.id);
        return NextResponse.json({ success: true, story });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[GET /api/admin/customer-stories/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to fetch story';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}

// ─── PUT /api/admin/customer-stories/[id] ─────────────────────────────────────

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = updateCustomerStorySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const story = await storyService.update(params.id, validation.data);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, story });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[PUT /api/admin/customer-stories/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to update story';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}

// ─── DELETE /api/admin/customer-stories/[id] ──────────────────────────────────

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();
        await storyService.delete(params.id);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, message: 'Story deleted' });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[DELETE /api/admin/customer-stories/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to delete story';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}
