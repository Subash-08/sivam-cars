/**
 * CarCardSkeleton & CarGridSkeleton — YouTube-style shimmer loading skeletons
 * that match the CarCard structure exactly.
 */

import './skeleton-shimmer.css';

function CarCardSkeleton() {
    return (
        <article className="bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col">
            {/* Thumbnail area */}
            <div className="relative aspect-[16/10] bg-muted skeleton-shimmer" />

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                {/* Title */}
                <div className="h-[18px] w-3/4 bg-muted rounded skeleton-shimmer" />

                {/* Specs grid */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
                    <div className="h-3.5 w-20 bg-muted rounded skeleton-shimmer" />
                    <div className="h-3.5 w-16 bg-muted rounded skeleton-shimmer" />
                    <div className="h-3.5 w-18 bg-muted rounded skeleton-shimmer" />
                    <div className="h-3.5 w-22 bg-muted rounded skeleton-shimmer" />
                </div>

                {/* Divider */}
                <div className="border-t border-border my-3" />

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="h-5 w-24 bg-muted rounded skeleton-shimmer" />
                    <div className="h-8 w-24 bg-muted rounded-lg skeleton-shimmer" />
                </div>
            </div>
        </article>
    );
}

export function CarGridSkeleton() {
    return (
        <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                    <CarCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export default CarCardSkeleton;
