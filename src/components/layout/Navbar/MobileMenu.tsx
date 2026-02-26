'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';
import { siteConfig } from '@/config/site';

function MobileMenuContent({ navItems }: { navItems: NavItem[] }): React.JSX.Element {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const close = useCallback((): void => {
        setIsOpen(false);
    }, []);

    // Close drawer on route change
    useEffect(() => {
        close();
    }, [pathname, close]);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    function isActive(href: string, isDropdownParent: boolean = false): boolean {
        if (href === '/') return pathname === '/';

        const [basePath, queryString] = href.split('?');

        // If it's a parent dropdown toggle (like "Price" or "Year" linking to /buy-cars)
        if (isDropdownParent && href === '/buy-cars') {
            return false; // Don't highlight the parent just because we are on /buy-cars
        }

        if (queryString && searchParams) {
            const params = new URLSearchParams(queryString);
            let allMatch = true;
            params.forEach((value, key) => {
                if (searchParams.get(key) !== value) {
                    allMatch = false;
                }
            });
            if (allMatch && pathname === basePath) return true;
            return false;
        }

        return pathname === basePath || pathname.startsWith(`${basePath}/`);
    }

    return (
        <div className="lg:hidden">
            {/* Hamburger trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu-drawer"
            >
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Backdrop overlay */}
            <div
                className={cn(
                    'fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={close}
                aria-hidden="true"
            />

            {/* Slide-in drawer */}
            <div
                id="mobile-menu-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={cn(
                    'fixed top-0 right-0 z-50 h-full w-[300px] max-w-[85vw] bg-background shadow-2xl transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-border px-4 h-16">
                    <span className="text-lg font-bold text-primary">
                        {siteConfig.name}
                    </span>
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-lg p-2 text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Close navigation menu"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Search inside drawer */}
                <div className="px-4 py-3 border-b border-border">
                    <form action="/buy-cars" method="get" role="search">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                name="q"
                                placeholder="Search cars..."
                                aria-label="Search cars"
                                className="w-full rounded-lg border border-border bg-muted/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                            />
                        </div>
                    </form>
                </div>

                {/* Navigation links */}
                <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto">
                    <ul className="px-2 py-2">
                        {navItems.map((item) => (
                            <li key={item.href} className="flex flex-col">
                                {item.children ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                                            className={cn(
                                                'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors w-full text-left',
                                                expandedItem === item.label || isActive(item.href, !!item.children)
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                                            )}
                                        >
                                            {item.label}
                                            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", expandedItem === item.label && "rotate-180")} />
                                        </button>

                                        {/* Nested Menu */}
                                        <div
                                            className={cn(
                                                "overflow-hidden transition-all duration-300 ease-in-out",
                                                expandedItem === item.label ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0 pointer-events-none"
                                            )}
                                        >
                                            <ul className="pl-6 pr-2 space-y-1 py-1">
                                                {item.children.map(child => (
                                                    <li key={child.href}>
                                                        <Link
                                                            href={child.href}
                                                            className={cn(
                                                                "block rounded-md px-3 py-2 text-sm transition-colors",
                                                                isActive(child.href)
                                                                    ? "bg-primary/5 text-primary font-semibold"
                                                                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                                                            )}
                                                            onClick={close}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={close}
                                        className={cn(
                                            'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                            isActive(item.href)
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Drawer footer */}
                <div className="border-t border-border px-4 py-4 mt-auto">
                    <Link
                        href="/contact"
                        className="flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors w-full"
                        aria-label="Get in touch with us"
                    >
                        Get in Touch
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function MobileMenu({ navItems }: { navItems: NavItem[] }): React.JSX.Element {
    return (
        <Suspense fallback={<button className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/70"><Menu className="h-6 w-6" /></button>}>
            <MobileMenuContent navItems={navItems} />
        </Suspense>
    );
}
