import Link from 'next/link';
import { Search } from 'lucide-react';
import { siteConfig } from '@/config/site';
import MobileMenu from './MobileMenu';
import type { NavItem } from '@/types';
import Image from 'next/image';

export default function MainHeader({ navItems }: { navItems: NavItem[] }): React.JSX.Element {
    return (
        <div className="bg-[#050505] border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-[72px] gap-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex-shrink-0 flex items-baseline gap-1.5 group"
                        aria-label={`${siteConfig.name} — ${siteConfig.tagline}`}
                    >
                        <Image src="/assets/images/logo-removebg-preview.png" alt={siteConfig.name} width={170} height={75} />
                    </Link>

                    {/* Search bar — SEO crawlable form */}
                    <form
                        action="/used-cars"
                        method="get"
                        role="search"
                        className="hidden md:flex flex-1 max-w-md mx-8 border border-white/10"
                    >
                        <div className="relative w-full">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                name="q"
                                placeholder="Search by car, brand, or model..."
                                aria-label="Search cars"
                                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-white-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </form>

                    <div className="flex items-center gap-3">
                        {/* Get in Touch CTA */}
                        <Link
                            href="/contact"
                            className="hidden sm:inline-flex items-center flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                            aria-label="Get in touch with us"
                        >
                            Get in Touch
                        </Link>

                        {/* Mobile hamburger menu */}
                        {/* Note: You may also need to update the MobileMenu component to use dark mode colors if it relies on light mode defaults */}
                        <MobileMenu navItems={navItems} />
                    </div>
                </div>
            </div>
        </div>
    );
}