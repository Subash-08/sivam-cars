import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { HomeSectionAdminService } from '@/services/admin/homeSectionAdmin.service';
import { createHomeSectionSchema, reorderHomeSectionsSchema } from '@/validations/admin/homeSection.schema';

const sectionService = new HomeSectionAdminService();

// ─── GET /api/admin/home-sections ─────────────────────────────────────────────

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
        console.error('[GET /api/admin/home-sections]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch sections' },
            { status: 500 },
        );
    }
}

// ─── POST /api/admin/home-sections ────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = createHomeSectionSchema.safeParse(body);

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
        console.error('[POST /api/admin/home-sections]', error);
        const message = error instanceof Error ? error.message : 'Failed to create section';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

// ─── PATCH /api/admin/home-sections — reorder ────────────────────────────────

export async function PATCH(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = reorderHomeSectionsSchema.safeParse(body);

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
        console.error('[PATCH /api/admin/home-sections]', error);
        const message = error instanceof Error ? error.message : 'Failed to reorder sections';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
