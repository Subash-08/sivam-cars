/**
 * src/app/(site)/blog/page.tsx
 *
 * Public blog listing page (Feed).
 * Exception to DECISION-003: Uses ISR via `revalidate = 60` for caching heavy read operations.
 */

import { Metadata } from 'next';
import { BlogService } from '@/services/blog/blog.service';
import BlogCard from '@/components/public/blog/BlogCard';
import BlogCTA from '@/components/public/blog/BlogCTA';
import Link from 'next/link';
import { Filter } from 'lucide-react';
import { siteConfig } from '@/config/site';

// [DECISION-012] Exception for Blog architecture
export const revalidate = 60;

export const metadata: Metadata = {
    title: `Automotive News & Guides | ${siteConfig.name}`,
    description: `Read the latest tips, guides, and news about buying and selling used cars in India from the experts at ${siteConfig.name}.`,
    alternates: {
        canonical: `${siteConfig.url}/blog`
    },
    openGraph: {
        title: `Automotive News & Guides | ${siteConfig.name}`,
        description: `Read the latest tips, guides, and news about buying and selling used cars from ${siteConfig.name}.`,
        url: `${siteConfig.url}/blog`,
        type: 'website'
    }
};

export default async function BlogListingPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const page = parseInt(searchParams.page || '1', 10);
    const { blogs, totalPages, total } = await BlogService.getPublicBlogs(page, 9);

    // Schema Markup
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: metadata.title,
        description: metadata.description,
        url: `${siteConfig.url}/blog`,
        publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.url}/logo.png`, // Fallback generic logo
            }
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Inject Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Header / Hero Area */}
            <div className="bg-muted border-b border-border py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4 text-balance">
                        Knowledge Base & <span className="text-primary">Articles</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                        Expert advice, maintenance tips, and the latest news in the used car market to help you make informed decisions.
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                    <p className="text-muted-foreground font-medium">Showing <span className="text-foreground">{blogs.length}</span> of {total} articles</p>

                    {/* Basic visual filter indicator, functionality could be added if category structure expands */}
                    <div className="hidden sm:flex items-center gap-2 text-sm text-foreground bg-secondary/50 px-3 py-1.5 rounded-md border border-border">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        All Categories
                    </div>
                </div>

                {blogs.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {blogs.map((blog: any, i: number) => (
                                <BlogCard
                                    key={blog._id}
                                    blog={blog}
                                    priority={i < 3} // LCP priority for top row
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <Link
                                        key={p}
                                        href={`/blog?page=${p}`}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${page === p
                                            ? 'bg-primary text-white pointer-events-none'
                                            : 'bg-card text-foreground border border-border hover:bg-muted'
                                            }`}
                                    >
                                        {p}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-32 bg-card rounded-2xl border border-border mt-8">
                        <h3 className="text-xl font-bold text-foreground mb-2">No articles found</h3>
                        <p className="text-muted-foreground">Check back later for new content updates.</p>
                    </div>
                )}
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <BlogCTA
                    title="Ready to find your dream car?"
                    description="Skip the research and let our experts find the perfect vehicle matching your budget and needs."
                />
            </div>
        </div>
    );
}
