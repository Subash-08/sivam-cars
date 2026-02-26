'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { LISTING_SORT_OPTIONS, type ListingSortOption } from '@/types/listing.types';

interface SortDropdownProps {
    currentSort: ListingSortOption;
}

export function SortDropdown({ currentSort }: SortDropdownProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'newest') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        params.set('page', '1');
        router.push(`/buy-cars?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="relative inline-block">
            <select
                value={currentSort}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-card border border-border text-foreground py-2 pl-3 pr-9 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors cursor-pointer"
                aria-label="Sort cars"
            >
                {LISTING_SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
        </div>
    );
}
