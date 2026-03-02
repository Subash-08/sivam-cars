/**
 * src/app/api/revalidate/route.ts
 *
 * On-demand ISR revalidation trigger.
 * Callable securely by Admin CMS or n8n routines upon publishing a blog.
 *
 * Example: POST /api/revalidate?secret=TOKEN&path=/blog
 */

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Read directly from URL params first to cleanly support basic webhook triggers
        const secret = request.nextUrl.searchParams.get('secret');
        const path = request.nextUrl.searchParams.get('path');
        const slug = request.nextUrl.searchParams.get('slug');

        const envSecret = process.env.ISR_REVALIDATE_SECRET || process.env.N8N_WEBHOOK_SECRET;

        // Verify Secret Token
        if (secret !== envSecret) {
            return NextResponse.json({ success: false, error: 'Invalid revalidation token' }, { status: 401 });
        }

        // Action 1: Revalidate specific given hard path string if requested (e.g., path=/blog)
        if (path) {
            revalidatePath(path);
        }

        // Action 2: Always revalidate the blog root index AND the specific individual slug if provided
        revalidatePath('/blog');
        if (slug) {
            revalidatePath(`/blog/${slug}`);
        }

        return NextResponse.json({
            success: true,
            revalidated: true,
            now: Date.now(),
            path,
            slug
        });
    } catch (err: any) {
        console.error('Error revalidating ISR:', err);
        return NextResponse.json(
            { success: false, error: 'Error revalidating ISR', details: err.message },
            { status: 500 }
        );
    }
}
