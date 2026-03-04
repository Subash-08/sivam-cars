import { type NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { VideoAdminService } from '@/services/admin/videoAdmin.service';
import { updateVideoSchema } from '@/validations/admin/video.schema';

const videoService = new VideoAdminService();

// ─── GET /api/admin/videos/[id] ───────────────────────────────────────────────

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();
        const video = await videoService.getById(params.id);
        return NextResponse.json({ success: true, video });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[GET /api/admin/videos/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to fetch video';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}

// ─── PUT /api/admin/videos/[id] ───────────────────────────────────────────────

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = updateVideoSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const video = await videoService.update(params.id, validation.data);
        return NextResponse.json({ success: true, video });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[PUT /api/admin/videos/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to update video';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}

// ─── DELETE /api/admin/videos/[id] ────────────────────────────────────────────

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();
        const result = await videoService.delete(params.id);
        return NextResponse.json({ success: true, ...result });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error(`[DELETE /api/admin/videos/${params.id}]`, error);
        const message = error instanceof Error ? error.message : 'Failed to delete video';
        const status = message.includes('not found') ? 404 : 400;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}
