import Link from 'next/link';
import { Search } from 'lucide-react';
import { siteConfig } from '@/config/site';
import MobileMenu from './MobileMenu';
import type { NavItem } from '@/types';

export default function MainHeader({ navItems }: { navItems: NavItem[] }): React.JSX.Element {
    return (
        <div className="bg-background border-b border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-[72px] gap-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex-shrink-0 flex items-baseline gap-1.5 group"
                        aria-label={`${siteConfig.name} — ${siteConfig.tagline}`}
                    >
                        <span className="text-xl sm:text-2xl font-bold tracking-tight text-primary group-hover:text-primary-hover transition-colors">
                            {siteConfig.name}
                        </span>
                        <span className="hidden sm:inline text-xs font-medium text-muted-foreground">
                            {siteConfig.tagline}
                        </span>
                    </Link>

                    {/* Search bar — SEO crawlable form */}
                    <form
                        action="/buy-cars"
                        method="get"
                        role="search"
                        className="hidden md:flex flex-1 max-w-md mx-8"
                    >
                        <div className="relative w-full">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                name="q"
                                placeholder="Search by car, brand, or model..."
                                aria-label="Search cars"
                                className="w-full rounded-lg border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                            />
                        </div>
                    </form>

                    <div className="flex items-center gap-3">
                        {/* Get in Touch CTA */}
                        <Link
                            href="/contact"
                            className="hidden sm:inline-flex items-center flex-shrink-0 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors glow-primary"
                            aria-label="Get in touch with us"
                        >
                            Get in Touch
                        </Link>

                        {/* Mobile hamburger menu */}
                        <MobileMenu navItems={navItems} />
                    </div>
                </div>
            </div>
        </div>
    );
}
