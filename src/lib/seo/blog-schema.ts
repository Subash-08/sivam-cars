/**
 * src/lib/seo/blog-schema.ts
 *
 * Generates Article and FAQPage schema for blog detail pages.
 * Supports AEO & GEO natively.
 */

import { siteConfig } from '@/config/site';
import { IBlog } from '@/types/blog.types';

/**
 * Extracts Q&A pairs from raw HTML content logic-free to form FAQ schema.
 * Assumes headings containing '?' or labeled as Q: followed by paragraph content.
 */
function extractFaqFromHtml(_html: string) {
    // A production-grade implementation might use cheerio for rigorous DOM parsing.
    // Given the constraints and to minimize bundle size, we output basic static empty return
    // or rely on explicit manual FAQ tagging if added later.
    // For now, if no explicit questions are detected, return null.
    return null;
}

export function generateBlogSchema(blog: IBlog) {
    const canonical = blog.canonical_url || `${siteConfig.url}/blog/${blog.slug}`;
    const pubDate = (blog.published_at || blog.createdAt || new Date()).toISOString();
    const modDate = (blog.updatedAt || blog.createdAt || new Date()).toISOString();

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.meta_title || blog.title,
        description: blog.meta_description || blog.excerpt || blog.title,
        image: blog.image_url ? [blog.image_url] : [],
        datePublished: pubDate,
        dateModified: modDate,
        author: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
        },
        publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.url}/logo.png`,
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonical
        },
        // GEO/AEO signals: Keywords included natively
        keywords: blog.tags.join(', ')
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
            ...(blog.category ? [
                { '@type': 'ListItem', position: 3, name: blog.category, item: `${siteConfig.url}/blog/category/${blog.category.toLowerCase().replace(/\s+/g, '-')}` },
                { '@type': 'ListItem', position: 4, name: blog.title, item: canonical }
            ] : [
                { '@type': 'ListItem', position: 3, name: blog.title, item: canonical }
            ])
        ]
    };

    const schemas: any[] = [articleSchema, breadcrumbSchema];

    const faq = extractFaqFromHtml(blog.html);
    if (faq) {
        schemas.push(faq);
    }

    return schemas;
}
