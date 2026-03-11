'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { parseFiltersFromUrl, buildListingUrl } from '@/lib/listing.utils';

interface ListingPaginationProps {
    pagination: {
        total: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export function ListingPagination({ pagination }: ListingPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    if (pagination.totalPages <= 1) return null;

    const goToPage = (page: number) => {
        const nextFilters = parseFiltersFromUrl(pathname, searchParams);
        nextFilters.page = [String(page)];
        // Retain scroll position normally by default, or disable scroll: false if preferred.
        // We'll leave it as default push.
        router.push(buildListingUrl(nextFilters));
    };

    // Build page number array with ellipsis
    const pages: Array<number | '...'> = [];
    const { page, totalPages } = pagination;

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push('...');
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }

    return (
        <nav className="flex justify-center items-center gap-1.5 mt-10" aria-label="Pagination">
            <button
                onClick={() => goToPage(page - 1)}
                disabled={!pagination.hasPrev}
                className="p-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">…</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${p === page
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted border border-border'
                            }`}
                        aria-current={p === page ? 'page' : undefined}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                onClick={() => goToPage(page + 1)}
                disabled={!pagination.hasNext}
                className="p-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
}
