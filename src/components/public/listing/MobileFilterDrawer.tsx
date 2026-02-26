'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { FilterStats } from '@/types/listing.types';
import { FilterSidebar } from '@/components/public/listing/FilterSidebar';

interface MobileFilterDrawerProps {
    stats: FilterStats;
    activeCount: number;
}

export function MobileFilterDrawer({ stats, activeCount }: MobileFilterDrawerProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Toggle button (visible on mobile, hidden on lg+) */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                aria-label="Open filters"
            >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeCount > 0 && (
                    <span className="ml-1 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
                        {activeCount}
                    </span>
                )}
            </button>

            {/* Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />
                    {/* Drawer */}
                    <aside className="absolute inset-y-0 left-0 w-[320px] max-w-[85vw] bg-background border-r border-border shadow-xl overflow-y-auto animate-slide-in">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-base font-semibold text-foreground">Filters</h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Close filters"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <FilterSidebar stats={stats} />
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
