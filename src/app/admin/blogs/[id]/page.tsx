/**
 * src/app/admin/blogs/[id]/page.tsx
 *
 * Page wrapper for editing an existing blog.
 */

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { BlogService } from '@/services/blog/blog.service';
import BlogForm from '@/components/admin/blogs/BlogForm';

export const metadata: Metadata = {
    title: 'Edit Blog | Admin',
};

export const dynamic = 'force-dynamic';

export default async function EditBlogPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/auth/login');

    try {
        const blog = await BlogService.getBlogById(params.id);

        if (!blog) {
            notFound();
        }

        return (
            <div className="min-h-[calc(100vh-4rem)]">
                <BlogForm
                    initialData={blog as any}
                    isEditing={true}
                    blogId={params.id}
                />
            </div>
        );
    } catch (e) {
        notFound();
    }
}
