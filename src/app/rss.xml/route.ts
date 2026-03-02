import { NextResponse } from 'next/server';
import { BlogService } from '@/services/blog/blog.service';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch up to 100 most recent published blogs for RSS
        const { blogs } = await BlogService.getPublicBlogs(1, 100);

        const feedXml = generateRssFeed(blogs);

        return new NextResponse(feedXml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        console.error('Error generating RSS:', error);
        return new NextResponse('Error generating RSS feed', { status: 500 });
    }
}

function generateRssFeed(blogs: any[]) {
    const siteUrl = siteConfig.url;

    const items = blogs.map((blog) => {
        const url = `${siteUrl}/blog/${blog.slug}`;
        const date = new Date(blog.published_at || blog.created_at).toUTCString();
        // Fallback description 
        const desc = blog.excerpt || blog.meta_description || 'Check out the full article on our blog.';

        // Very basic XML escaping
        const escapeXml = (unsafe: string) => unsafe.replace(/[<>&'"]/g, (c: string) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });

        return `
    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(desc)}</description>
      ${blog.category ? `<category>${escapeXml(blog.category)}</category>` : ''}
    </item>`;
    });

    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Automotive news, guides, and tips from ${siteConfig.name}</description>
    <language>en-in</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.join('')}
  </channel>
</rss>`;
}
