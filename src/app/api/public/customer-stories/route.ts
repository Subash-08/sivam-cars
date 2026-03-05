import { NextResponse } from 'next/server';
import { HomeService } from '@/services/public/home.service';

const homeService = new HomeService();

// ─── GET /api/public/customer-stories ─────────────────────────────────────────

export async function GET() {
    try {
        const stories = await homeService.getActiveCustomerStories();
        return NextResponse.json({ success: true, stories });
    } catch (error) {
        console.error('[GET /api/public/customer-stories]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stories' },
            { status: 500 },
        );
    }
}
