'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

function PrimaryNavContent({ navItems }: { navItems: NavItem[] }): React.JSX.Element {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isSticky, setIsSticky] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = (): void => {
            // Becomes sticky once user scrolls past TopBar + MainHeader (~108px)
            setIsSticky(window.scrollY > 108);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /**
     * Determines if a nav item is the active link.
     */
    function isActive(href: string, isDropdownParent: boolean = false): boolean {
        if (href === '/') return pathname === '/';

        const [basePath, queryString] = href.split('?');

        // If it's a parent dropdown toggle (like "Price" or "Year" linking to /buy-cars)
        if (isDropdownParent && href === '/buy-cars') {
            return false; // Don't highlight the parent just because we are on /buy-cars
        }

        // For children with query params, check if the query param exists in the current URL
        if (queryString && searchParams) {
            // simplified check: just check if the current full URL ends with this exact href
            // or check if ALL params in the href exist in the current searchParams
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
        <>
            <nav
                className={cn(
                    'hidden lg:block bg-background border-b border-border transition-shadow duration-200',
                    isSticky && 'fixed top-0 left-0 right-0 z-50 shadow-md'
                )}
                aria-label="Primary navigation"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ul className="flex items-center gap-1 h-11">
                        {navItems.map((item) => (
                            <li key={item.href} className="group relative">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                                        'hover:text-primary',
                                        'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-primary after:origin-left after:scale-x-0 after:transition-transform after:duration-200',
                                        'hover:after:scale-x-100',
                                        isActive(item.href, !!item.children)
                                            ? 'text-primary after:scale-x-100'
                                            : 'text-foreground/80'
                                    )}
                                >
                                    {item.label}
                                    {item.children && <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />}
                                </Link>

                                {item.children && (
                                    <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                                        <div className="bg-card border border-border rounded-xl shadow-lg w-56 py-2">
                                            <ul className="flex flex-col">
                                                {item.children.map((child) => (
                                                    <li key={child.label + child.href}>
                                                        <Link
                                                            href={child.href}
                                                            className={cn(
                                                                "block px-4 py-2 text-sm transition-colors",
                                                                isActive(child.href)
                                                                    ? "text-primary font-semibold bg-primary/5"
                                                                    : "text-foreground hover:bg-muted hover:text-primary"
                                                            )}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Spacer to prevent content jump when nav becomes fixed */}
            {isSticky && (
                <div className="hidden lg:block h-11" aria-hidden="true" />
            )}
        </>
    );
}

export default function PrimaryNav({ navItems }: { navItems: NavItem[] }): React.JSX.Element {
    return (
        <Suspense fallback={<div className="h-11 border-b border-border bg-background" />}>
            <PrimaryNavContent navItems={navItems} />
        </Suspense>
    );
}
