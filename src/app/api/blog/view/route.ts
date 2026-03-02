/**
 * src/app/api/blog/view/route.ts
 *
 * Public unauthenticated incrementer for blog tracking.
 */
import { NextResponse } from 'next/server';
import { BlogService } from '@/services/blog/blog.service';

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) return NextResponse.json({ success: false }, { status: 400 });

        await BlogService.incrementViews(slug);

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false });
    }
}
