import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { BlogService } from '@/services/blog/blog.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/cars`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/sell`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/loan`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/emi-calculator`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/auth/login`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.1,
        },
    ];

    // Add dynamic blogs
    try {
        const { blogs } = await BlogService.getPublicBlogs(1, 1000);
        const blogRoutes = blogs.map((blog: any) => ({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: new Date(blog.updatedAt || blog.published_at || blog.created_at),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
        staticRoutes.push(...blogRoutes);
    } catch (err) {
        console.error('Sitemap Blog Fetch error:', err);
    }

    return staticRoutes;
}
