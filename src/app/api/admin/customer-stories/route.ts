import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { CustomerStoryAdminService } from '@/services/admin/customerStoryAdmin.service';
import { createCustomerStorySchema, reorderCustomerStoriesSchema } from '@/validations/admin/customerStory.schema';

const storyService = new CustomerStoryAdminService();

// ─── GET /api/admin/customer-stories ──────────────────────────────────────────

export async function GET() {
    try {
        await requireAdmin();
        const stories = await storyService.getAll();
        return NextResponse.json({ success: true, stories });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[GET /api/admin/customer-stories]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stories' },
            { status: 500 },
        );
    }
}

// ─── POST /api/admin/customer-stories ─────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = createCustomerStorySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const story = await storyService.create(validation.data);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, story }, { status: 201 });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[POST /api/admin/customer-stories]', error);
        const message = error instanceof Error ? error.message : 'Failed to create story';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

// ─── PATCH /api/admin/customer-stories — reorder ─────────────────────────────

export async function PATCH(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = reorderCustomerStoriesSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        const stories = await storyService.reorder(validation.data.orderedIds);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, stories });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[PATCH /api/admin/customer-stories]', error);
        const message = error instanceof Error ? error.message : 'Failed to reorder stories';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
