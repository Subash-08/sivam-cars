import { type NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { VideoSectionAdminService } from '@/services/admin/videoSectionAdmin.service';
import { updateVideoSectionSchema } from '@/validations/admin/videoSection.schema';

const sectionService = new VideoSectionAdminService();

// ─── GET /api/admin/video-sections/[id] ───────────────────────────────────────

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();
        const section = await sectionService.getById(params.id);
        return NextResponse.json({ success: true, section });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[GET /api/admin/video-sections/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to fetch section';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}

// ─── PUT /api/admin/video-sections/[id] ───────────────────────────────────────

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = updateVideoSectionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const section = await sectionService.update(params.id, validation.data);
        return NextResponse.json({ success: true, section });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[PUT /api/admin/video-sections/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to update section';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}

// ─── DELETE /api/admin/video-sections/[id] ────────────────────────────────────

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();
        await sectionService.delete(params.id);
        return NextResponse.json({ success: true, message: 'Section deleted' });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[DELETE /api/admin/video-sections/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to delete section';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}
