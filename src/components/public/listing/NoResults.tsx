'use client';

import { useRouter } from 'next/navigation';
import { SearchX } from 'lucide-react';

export function NoResults() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <SearchX className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No cars found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                We couldn&apos;t find any cars matching your criteria. Try adjusting your filters or clearing them.
            </p>
            <button
                onClick={() => router.push('/buy-cars')}
                className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors"
            >
                Clear All Filters
            </button>
        </div>
    );
}
