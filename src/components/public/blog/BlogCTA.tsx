/**
 * src/components/public/blog/BlogCTA.tsx
 *
 * Reusable CTA component designed for lead conversion inside and at the end of blog posts.
 */
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface BlogCTAProps {
    variant?: 'inline' | 'bottom';
    title?: string;
    description?: string;
}

export default function BlogCTA({
    variant = 'bottom',
    title = 'Looking for a Reliable Used Car?',
    description = 'Browse our handpicked inventory of premium used cars. Every car is inspected and certified.'
}: BlogCTAProps) {

    if (variant === 'inline') {
        return (
            <div className="my-8 p-6 bg-secondary/30 border-l-4 border-primary rounded-r-xl flex flex-col sm:flex-row items-center justify-between gap-6 not-prose">
                <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground m-0">
                        {description}
                    </p>
                </div>
                <Link
                    href="/used-cars"
                    className="shrink-0 flex items-center justify-center bg-primary text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
                >
                    View Inventory
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-16 bg-card border border-border rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm card-elevated z-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 inset-0 z-0 pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col items-center">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    Trusted Local Dealership
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
                    {title}
                </h2>
                <p className="text-muted-foreground mb-8 text-balance max-w-xl mx-auto">
                    {description} Our experts at {siteConfig.name} are ready to help you find the perfect match. Call us today.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                    <Link
                        href="/used-cars"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-hover transition-colors glow-primary"
                    >
                        Browse Inventory <ArrowRight className="w-5 h-5" />
                    </Link>
                    <a
                        href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-foreground font-bold px-8 py-4 rounded-xl hover:bg-secondary/80 transition-colors"
                    >
                        <Phone className="w-5 h-5" /> {siteConfig.phone}
                    </a>
                </div>

                <p className="mt-6 text-xs text-muted-foreground">
                    No pressure. No gimmicks. Just honest car sales.
                </p>
            </div>
        </div>
    );
}
