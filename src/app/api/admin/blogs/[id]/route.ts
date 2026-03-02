/**
 * src/app/api/admin/blogs/[id]/route.ts
 *
 * Handles editing and deleting a specific blog post.
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BlogService } from '@/services/blog/blog.service';
import { BlogUpdateSchema } from '@/validations/blog.schema';

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const blog = await BlogService.getBlogById(params.id);
        if (!blog) {
            return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: blog });
    } catch (error: Omit<Error, "stack"> | any) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const authHeader = request.headers.get('Authorization');
        const validWebhookToken = authHeader === `Bearer ${process.env.N8N_WEBHOOK_SECRET}`;

        if (!session && !validWebhookToken) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = BlogUpdateSchema.parse(body);

        const updatedBlog = await BlogService.updateBlog(params.id, validatedData);

        return NextResponse.json({ success: true, data: updatedBlog });
    } catch (error: Omit<Error, "stack"> | any) {
        console.error('Error updating blog:', error);
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const authHeader = request.headers.get('Authorization');
        const validWebhookToken = authHeader === `Bearer ${process.env.N8N_WEBHOOK_SECRET}`;

        if (!session && !validWebhookToken) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await BlogService.deleteBlogById(params.id);

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error: Omit<Error, "stack"> | any) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
