/**
 * src/app/(site)/blog/tag/[slug]/page.tsx
 *
 * Blog Tag Listing page.
 * Uses noindex to prevent thin-content SEO issues, while allowing human discovery.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogService } from '@/services/blog/blog.service';
import BlogCard from '@/components/public/blog/BlogCard';
import BlogCTA from '@/components/public/blog/BlogCTA';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const p = await params;
    const tagName = p.slug.replace(/-/g, ' ');

    return {
        title: `Posts tagged as ${tagName} | ${siteConfig.name}`,
        description: `Browse all articles related to ${tagName}.`,
        robots: {
            index: false, // Per requirements: thin content prevention
            follow: true
        }
    };
}

export default async function BlogTagPage({ params, searchParams }: PageProps) {
    const sParams = await searchParams;
    const p = await params;
    const page = parseInt(sParams.page || '1', 10);
    const tagName = p.slug.replace(/-/g, ' ');

    const { blogs, totalPages, total } = await BlogService.getPublicBlogs(page, 9, { tag: tagName });

    if (total === 0 && page === 1) {
        notFound();
    }

    return (
        <div className="min-h-screen pb-20">
            <div className="bg-muted border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to all articles
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4 flex items-center gap-3">
                        <Tag className="w-8 h-8 text-primary" /> Tag: {tagName}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Browsing {total} articles relating to {tagName}.
                    </p>
                </div>
            </div>

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
                                href={`/blog/tag/${p.slug}?page=${p_num}`}
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
