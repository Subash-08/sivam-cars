import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { VideoAdminService } from '@/services/admin/videoAdmin.service';
import { createVideoSchema } from '@/validations/admin/video.schema';

const videoService = new VideoAdminService();

// ─── GET /api/admin/videos ─────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12')));
        const search = searchParams.get('search') ?? '';

        const result = await videoService.getAll(page, limit, search);
        return NextResponse.json({ success: true, ...result });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[GET /api/admin/videos]', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch videos' }, { status: 500 });
    }
}

// ─── POST /api/admin/videos ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = createVideoSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const video = await videoService.create(validation.data);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, video }, { status: 201 });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[POST /api/admin/videos]', error);
        const message = error instanceof Error ? error.message : 'Failed to create video';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
