/**
 * src/app/admin/blogs/page.tsx
 *
 * Admin Dashboard - Blog Listing Page
 * Fetches blogs directly through the internal service (Server Component).
 */

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { BlogService } from '@/services/blog/blog.service';
import BlogTable from '@/components/admin/blogs/BlogTable';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Manage Blogs | Admin',
};

// Next.js dynamic rendering configuration for admin routes
export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage({
    searchParams,
}: {
    searchParams: { page?: string; search?: string; status?: string; category?: string };
}) {
    // 1. Session Protection
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/auth/login');
    }

    // 2. Parse Search Params
    const page = parseInt(searchParams.page || '1', 10);
    const search = searchParams.search;
    const status = searchParams.status && searchParams.status !== 'all' ? (searchParams.status as any) : undefined;
    const category = searchParams.category;

    // 3. Fetch Data Directly (No fetch calls, using service for speed + security)
    const { blogs, total, totalPages } = await BlogService.getAdminBlogs(page, 20, {
        search,
        status,
        category,
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Blog Management</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Create, edit, and organize content for the public blog. Total: {total} posts.
                </p>
            </div>

            {/* Client Component Wrapper for Table Interactivity */}
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-muted-foreground">Loading blogs...</div>}>
                <BlogTable
                    initialBlogs={blogs as any}
                    initialTotal={total}
                    initialTotalPages={totalPages}
                />
            </Suspense>
        </div>
    );
}
