import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

const popularSearches = [
    { label: 'Used Cars Under 3 Lakh', href: '/used-cars-under-3-lakh' },
    { label: 'Used Cars Under 5 Lakh', href: '/used-cars-under-5-lakh' },
    { label: 'Used Cars Under 10 Lakh', href: '/used-cars-under-10-lakh' },
    { label: 'Used SUV Cars', href: '/used-suv-cars' },
    { label: 'Used Sedan Cars', href: '/used-sedan-cars' },
    { label: 'Used Hyundai Cars', href: '/used-hyundai-cars' },
    { label: 'Used Kia Cars', href: '/used-kia-cars' },
    { label: 'Used Petrol Cars', href: '/used-petrol-cars' },
    { label: 'Used Diesel Cars', href: '/used-diesel-cars' },
];

export default function PopularSearchesSection() {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 uppercase">
                            <Search className="inline-block w-6 h-6 mr-2 text-red-600 -mt-1" />
                            Popular Used Car Searches
                        </h2>
                        <p className="mt-1 text-zinc-500 text-sm">
                            Quickly browse the most requested categories and budgets.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {popularSearches.map((search, index) => (
                        <Link 
                            key={index} 
                            href={search.href} 
                            className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-zinc-700 text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                        >
                            {search.label}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
