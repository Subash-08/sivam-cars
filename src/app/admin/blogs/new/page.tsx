/**
 * src/app/admin/blogs/new/page.tsx
 *
 * Page wrapper for creating a new blog.
 */

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import BlogForm from '@/components/admin/blogs/BlogForm';

export const metadata: Metadata = {
    title: 'Create Blog | Admin',
};

export const dynamic = 'force-dynamic';

export default async function NewBlogPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/auth/login');

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            <BlogForm isEditing={false} />
        </div>
    );
}
