import { NextResponse } from 'next/server';
import { HomeService } from '@/services/public/home.service';

// ─── GET /api/public/homepage-brands ──────────────────────────────────────────

export async function GET() {
    try {
        const homeService = new HomeService();
        const brands = await homeService.getHomepageBrands();
        return NextResponse.json({ success: true, brands });
    } catch (error) {
        console.error('[GET /api/public/homepage-brands]', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch homepage brands' }, { status: 500 });
    }
}
