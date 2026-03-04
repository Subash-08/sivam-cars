import { NextResponse } from 'next/server';
import { VideoSectionService } from '@/services/public/videoSection.service';

const videoSectionService = new VideoSectionService();

// ─── GET /api/public/video-sections ───────────────────────────────────────────
// No auth required — public endpoint.
// Returns only active sections, sorted by order, with limited video field projection.

export async function GET() {
    try {
        const sections = await videoSectionService.getActiveVideoSections();
        return NextResponse.json({ success: true, sections });
    } catch (error: unknown) {
        console.error('[GET /api/public/video-sections]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch video sections' },
            { status: 500 },
        );
    }
}
