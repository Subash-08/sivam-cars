import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { VideoSectionAdminService } from '@/services/admin/videoSectionAdmin.service';
import { createVideoSectionSchema, reorderVideoSectionsSchema } from '@/validations/admin/videoSection.schema';

const sectionService = new VideoSectionAdminService();

// ─── GET /api/admin/video-sections ────────────────────────────────────────────

export async function GET() {
    try {
        await requireAdmin();
        const sections = await sectionService.getAll();
        return NextResponse.json({ success: true, sections });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[GET /api/admin/video-sections]', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch sections' }, { status: 500 });
    }
}

// ─── POST /api/admin/video-sections ───────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = createVideoSectionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const section = await sectionService.create(validation.data);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, section }, { status: 201 });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[POST /api/admin/video-sections]', error);
        const message = error instanceof Error ? error.message : 'Failed to create section';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

// ─── PATCH /api/admin/video-sections — reorder ──────────────────────────────

export async function PATCH(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = reorderVideoSectionsSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const sections = await sectionService.reorder(validation.data.orderedIds);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, sections });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[PATCH /api/admin/video-sections]', error);
        const message = error instanceof Error ? error.message : 'Failed to reorder sections';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
