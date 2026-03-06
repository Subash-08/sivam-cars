import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { HeroSettingAdminService } from '@/services/admin/heroSettingAdmin.service';
import { updateHeroSettingSchema } from '@/validations/admin/heroSetting.schema';

const heroSettingService = new HeroSettingAdminService();

// ─── GET /api/admin/hero-settings ─────────────────────────────────────────────

export async function GET() {
    try {
        await requireAdmin();
        const settings = await heroSettingService.getSettings();
        return NextResponse.json({ success: true, settings });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status }
            );
        }
        console.error('[GET /api/admin/hero-settings]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch hero settings' },
            { status: 500 }
        );
    }
}

// ─── PATCH /api/admin/hero-settings ───────────────────────────────────────────

export async function PATCH(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const validation = updateHeroSettingSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 }
            );
        }

        const updatedSettings = await heroSettingService.updateSettings(validation.data);
        revalidatePath('/');
        return NextResponse.json({ success: true, settings: updatedSettings });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status }
            );
        }
        console.error('[PATCH /api/admin/hero-settings]', error);
        const message = error instanceof Error ? error.message : 'Failed to update hero settings';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
