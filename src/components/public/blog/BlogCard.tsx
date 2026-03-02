/**
 * src/components/public/blog/BlogCard.tsx
 *
 * Standardized presentation card for blog feed.
 */
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface BlogCardProps {
    blog: any; // Mongoose Lean Document Type
    priority?: boolean;
}

export default function BlogCard({ blog, priority = false }: BlogCardProps) {
    // Format the date securely 
    const rawDate = blog.published_at || blog.created_at;
    const formattedDate = new Date(rawDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <Link href={`/blog/${blog.slug}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 card-elevated overflow-hidden flex flex-col relative z-0">
                <div className="aspect-[16/9] w-full relative overflow-hidden bg-muted">
                    {blog.image_url ? (
                        <Image
                            src={blog.image_url}
                            alt={blog.image_alt || blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={priority}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                            No Image Available
                        </div>
                    )}

                    {/* Category Badge overlay */}
                    {blog.category && (
                        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-foreground z-10 border border-border/50">
                            {blog.category}
                        </div>
                    )}
                </div>

                <CardContent className="p-6 flex flex-col flex-1 transform translate-z-0">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium mb-3">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={new Date(rawDate).toISOString()}>{formattedDate}</time>
                        </div>
                        {blog.reading_time > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>{blog.reading_time} min read</span>
                            </div>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {blog.title}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 text-balance">
                        {blog.excerpt || "Click to read the full article and learn more about this topic."}
                    </p>

                    <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all mt-auto capitalize">
                        Read Article <ArrowRight className="w-4 h-4" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
