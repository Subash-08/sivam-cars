/**
 * src/app/api/admin/blogs/route.ts
 *
 * Handles creation and listing of blogs for the admin panel / n8n automation.
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BlogService } from '@/services/blog/blog.service';
import { BlogCreateSchema } from '@/validations/blog.schema';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '20', 10);
        const search = searchParams.get('search') || undefined;
        const category = searchParams.get('category') || undefined;

        const result = await BlogService.getAdminBlogs(page, limit, { search, category });

        return NextResponse.json({ success: true, ...result });
    } catch (error: Omit<Error, "stack"> | any) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        // We allow POST either by Session (Admin) OR by a direct API Header Secret (n8n Webhook Auth)
        const session = await getServerSession(authOptions);
        const authHeader = request.headers.get('Authorization');
        const validWebhookToken = authHeader === `Bearer ${process.env.N8N_WEBHOOK_SECRET}`;

        if (!session && !validWebhookToken) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate payload shape
        const validatedData = BlogCreateSchema.parse(body);

        // Service inherently handles DOMPurify and Date formatting
        const blog = await BlogService.createBlog(validatedData);

        // Optional: Trigger background ISR revalidation dynamically if published right away

        return NextResponse.json({ success: true, data: blog }, { status: 201 });
    } catch (error: Omit<Error, "stack"> | any) {
        console.error('Error creating blog:', error);

        // Handle Zod validation errors nicely
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }

        // Handle Mongoose duplicate key error (slug)
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'A blog with this slug already exists.' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
