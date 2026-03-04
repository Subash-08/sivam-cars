import { NextResponse } from 'next/server';
import { HomeService } from '@/services/public/home.service';

const homeService = new HomeService();

// ─── GET /api/public/home-sections ────────────────────────────────────────────

export async function GET() {
    try {
        const sections = await homeService.getActiveHomeSections();
        return NextResponse.json({ success: true, sections });
    } catch (error) {
        console.error('[GET /api/public/home-sections]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch sections' },
            { status: 500 },
        );
    }
}
