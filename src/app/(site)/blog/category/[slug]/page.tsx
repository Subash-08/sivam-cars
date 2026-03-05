/**
 * src/app/(site)/blog/category/[slug]/page.tsx
 *
 * Blog Category Listing page.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogService } from '@/services/blog/blog.service';
import BlogCard from '@/components/public/blog/BlogCard';
import BlogCTA from '@/components/public/blog/BlogCTA';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const p = await params;
    const rawCategory = p.slug.replace(/-/g, ' ');
    // Capitalize first letters
    const categoryName = rawCategory.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const title = `${categoryName} Archives | ${siteConfig.name} Blog`;
    const description = `Read all the latest articles, guides, and tips relating to ${categoryName} from ${siteConfig.name}.`;

    return {
        title,
        description,
        alternates: { canonical: `${siteConfig.url}/blog/category/${p.slug}` },
        openGraph: { title, description, url: `${siteConfig.url}/blog/category/${p.slug}` }
    };
}

export default async function BlogCategoryPage({ params, searchParams }: PageProps) {
    const sParams = await searchParams;
    const p = await params;
    const page = parseInt(sParams.page || '1', 10);

    // Reverse engineer slug to match internal String representation natively
    const rawCategory = p.slug.replace(/-/g, ' ');
    // Mongoose regex matches ignoring case, but we need to provide a usable string to query builder
    const categoryPattern = new RegExp(`^${rawCategory}$`, 'i');

    const { blogs, totalPages, total } = await BlogService.getPublicBlogs(page, 9, { category: categoryPattern as any });

    if (total === 0 && page === 1) {
        // If the category literally doesn't exist to have even 1 post, 404
        notFound();
    }

    const friendlyName = p.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="min-h-screen pb-20">
            <div className="bg-muted border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to all articles
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                        Category: <span className="text-primary">{friendlyName}</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Browsing {total} articles tagged under {friendlyName}.
                    </p>
                </div>
            </div>

            {/* Grid & Feed Code similar to main /blog route */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {blogs.map((blog: any) => (
                        <BlogCard key={blog._id} blog={blog} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p_num) => (
                            <Link
                                key={p_num}
                                href={`/blog/category/${p.slug}?page=${p_num}`}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${page === p_num ? 'bg-primary text-white pointer-events-none' : 'bg-card text-foreground border border-border hover:bg-muted'
                                    }`}
                            >
                                {p_num}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <BlogCTA />
            </div>
        </div>
    );
}
