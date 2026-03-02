/**
 * src/app/(site)/blog/[slug]/page.tsx
 *
 * Public blog detail view.
 * Uses ISR (revalidate = 300) for fast reads while allowing n8n updates to propagate reasonably fast.
 */

import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BlogService } from '@/services/blog/blog.service';
import { siteConfig } from '@/config/site';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import BlogCTA from '@/components/public/blog/BlogCTA';
import ViewTracker from '@/components/public/blog/ViewTracker';
import BlogCard from '@/components/public/blog/BlogCard';

export const revalidate = 300; // [DECISION-012]

interface PageProps {
    params: { slug: string };
}

// Dynamic metadata generation for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const blog = await BlogService.getBlogBySlug(params.slug);

    if (!blog) return { title: 'Blog Not Found' };

    const title = blog.meta_title || `${blog.title} | ${siteConfig.name} Blog`;
    const description = blog.meta_description || blog.excerpt || blog.title;
    const url = `${siteConfig.url}/blog/${blog.slug}`;
    const canonical = blog.canonical_url || url;

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title: blog.og_title || title,
            description: blog.og_description || description,
            url,
            images: blog.image_url ? [{ url: blog.image_url, width: 1200, height: 630, alt: blog.image_alt || title }] : [],
            type: 'article',
            publishedTime: blog.published_at ? new Date(blog.published_at).toISOString() : undefined,
            authors: [siteConfig.name],
        },
        twitter: {
            card: 'summary_large_image',
            title: blog.og_title || title,
            description: blog.og_description || description,
            images: blog.image_url ? [blog.image_url] : [],
        },
        robots: blog.noindex ? { index: false, follow: false } : { index: true, follow: true },
    };
}

export default async function BlogDetailPage({ params }: PageProps) {
    const blog = await BlogService.getBlogBySlug(params.slug);

    if (!blog) {
        notFound();
    }

    const { category, title, html, reading_time, image_url, image_alt, published_at, createdAt } = blog;

    // Fetch relationships in parallel 
    const [relatedBlogs, popularBlogs] = await Promise.all([
        BlogService.getRelatedBlogs(category, params.slug, 3),
        BlogService.getPopularBlogs(3)
    ]);

    // Format the date securely
    const rawDate = published_at || createdAt;
    const formattedDate = new Date(rawDate as Date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Simple Breadcrumbs
    const currentCategoryUrl = category ? `/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}` : null;

    // Structured SEO Mapping (Article, Org, Breadcrumb)
    // In production, this imports the previously built generateBlogSchema output, 
    // structured here inline quickly for robust JSON serialization mapping
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                headline: blog.meta_title || title,
                description: blog.meta_description || blog.excerpt || title,
                image: image_url ? [image_url] : [],
                datePublished: new Date(published_at || createdAt || new Date()).toISOString(),
                dateModified: new Date(blog.updatedAt || createdAt || new Date()).toISOString(),
                author: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
                publisher: { '@type': 'Organization', name: siteConfig.name, logo: { '@type': 'ImageObject', url: `${siteConfig.url}/logo.png` } },
                mainEntityOfPage: { '@type': 'WebPage', '@id': blog.canonical_url || `${siteConfig.url}/blog/${params.slug}` },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
                    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
                    ...(category ? [{ '@type': 'ListItem', position: 3, name: category, item: `${siteConfig.url}${currentCategoryUrl}` }] : []),
                    { '@type': 'ListItem', position: category ? 4 : 3, name: title, item: `${siteConfig.url}/blog/${params.slug}` }
                ]
            }
        ]
    };

    return (
        <article className="min-h-screen pb-20 bg-background">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Silent Tracker */}
            <ViewTracker slug={params.slug} />

            {/* Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

                {/* Breadcrumbs */}
                <nav className="mb-8 overflow-x-auto pb-2">
                    <ol className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                        <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                        <li><ChevronRight className="w-3 h-3" /></li>
                        <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                        {category && (
                            <>
                                <li><ChevronRight className="w-3 h-3" /></li>
                                <li><Link href={currentCategoryUrl!} className="hover:text-primary transition-colors capitalize">{category}</Link></li>
                            </>
                        )}
                        <li><ChevronRight className="w-3 h-3" /></li>
                        <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">{title}</li>
                    </ol>
                </nav>

                {/* Article Header */}
                <header className="mb-10 text-center sm:text-left">
                    {category && (
                        <Link href={currentCategoryUrl!} className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            {category}
                        </Link>
                    )}

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6 leading-tight text-balance">
                        {title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-sm text-muted-foreground font-medium border-y border-border py-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                S
                            </div>
                            <span className="text-foreground">{siteConfig.name} Experts</span>
                        </div>
                        <div className="flex items-center gap-1.5 border-l border-border pl-4">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={new Date(rawDate as Date).toISOString()}>{formattedDate}</time>
                        </div>
                        {reading_time !== undefined && reading_time > 0 && (
                            <div className="flex items-center gap-1.5 border-l border-border pl-4">
                                <Clock className="w-4 h-4" />
                                <span>{reading_time} min read</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Featured Image */}
                {image_url && (
                    <figure className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-border aspect-video relative bg-muted card-elevated">
                        <Image
                            src={image_url}
                            alt={image_alt || title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 896px"
                            className="object-cover"
                        />
                    </figure>
                )}

                {/* Article Content / Markup rendered directly (Sanitized by DB entry layer) */}
                <div
                    className="prose prose-lg dark:prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary-hover max-w-none mb-16"
                    dangerouslySetInnerHTML={{ __html: html }}
                />

                {/* Dynamic Inline CTA injected by author, or default appended to end */}
                <BlogCTA variant="inline" />
            </div>

            {/* Read Next Section */}
            {(relatedBlogs.length > 0 || popularBlogs.length > 0) && (
                <div className="bg-muted border-t border-border py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-foreground">
                                {relatedBlogs.length > 0 ? "Related Articles" : "Popular Reads"}
                            </h2>
                            <Link href="/blog" className="text-primary hover:underline font-medium text-sm flex items-center gap-1">
                                View all <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Prioritize related blogs, fallback to popular if none relate */}
                            {(relatedBlogs.length > 0 ? relatedBlogs : popularBlogs).slice(0, 3).map((b: any) => (
                                <BlogCard key={b._id} blog={b} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Final Lead Gen conversion */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 max-w-6xl">
                <BlogCTA />
            </div>
        </article>
    );
}
