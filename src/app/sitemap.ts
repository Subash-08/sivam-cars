import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { BlogService } from '@/services/blog/blog.service';
import { CarFilterService } from '@/services/filter/carFilter.service';
import { Car } from '@/models';
import { connectDB } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/cars`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
        { url: `${baseUrl}/used-cars`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/sell`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/loan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/emi-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ];

    try {
        await connectDB();
        const baseQuery = { isActive: true, isDeleted: false, isSold: false };
        const filterService = new CarFilterService(false);
        const stats = await filterService.getFilterStats(baseQuery);

        const pushRoute = (path: string, priority: number) => {
            staticRoutes.push({
                url: `${baseUrl}${path}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority,
            });
        };

        // 1. Brands
        stats.brands.forEach(b => {
            if (b.slug) pushRoute(`/used-${b.slug}-cars`, 0.8);
        });

        // 2. Body Types
        stats.bodyTypes.forEach(b => {
            if (b.value) pushRoute(`/used-${b.value.toLowerCase()}-cars`, 0.8);
        });

        // 3. Fuel Types
        stats.fuelTypes.forEach(f => {
            if (f.value) pushRoute(`/used-${f.value.toLowerCase()}-cars`, 0.7);
        });

        // 4. Transmissions
        stats.transmissions.forEach(t => {
            if (t.value) pushRoute(`/used-${t.value.toLowerCase()}-cars`, 0.6);
        });

        // 5. Budgets (Fixed list)
        const budgets = ['50k', '1-lakh', '2-lakh', '3-lakh', '5-lakh', '7-lakh', '10-lakh', '15-lakh', '20-lakh'];
        budgets.forEach(b => {
            pushRoute(`/used-cars-under-${b}`, 0.9);
        });

        // 6. Years (2012+)
        const currentYear = new Date().getFullYear();
        const minYear = Math.max(2012, stats.yearRange.min);
        const maxYear = Math.min(currentYear, stats.yearRange.max);
        if (minYear <= maxYear) {
            for (let y = minYear; y <= maxYear; y++) {
                pushRoute(`/${y}-used-cars`, 0.6);
            }
        }

        // 7. Cities
        const cityAgg = await Car.aggregate([
            { $match: baseQuery },
            { $group: { _id: '$location.city' } },
        ]);
        cityAgg.forEach(c => {
            if (c._id && typeof c._id === 'string') {
                const citySlug = c._id.toLowerCase().trim().replace(/\s+/g, '-');
                pushRoute(`/used-cars-in-${citySlug}`, 0.9);
            }
        });

    } catch (err) {
        console.error('Sitemap Programmatic Routes error:', err);
    }

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
