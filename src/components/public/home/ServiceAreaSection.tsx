import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

const serviceAreas = [
    { city: 'Kallakurichi', href: '/used-cars-in-kallakurichi', desc: 'Browse our extensive range of verified pre-owned cars in Kallakurichi.' },
    { city: 'Attur', href: '/used-cars-in-attur', desc: 'Explore quality second-hand cars available near Attur.' },
    { city: 'Salem', href: '/used-cars-in-salem', desc: 'Find reliable used sedans, SUVs, and hatchbacks in Salem.' },
    { city: 'Ulundurpet', href: '/used-cars-in-ulundurpet', desc: 'Discover affordable used cars with flexible EMI options in Ulundurpet.' }
];

export default function ServiceAreaSection() {
    return (
        <section className="py-16 bg-zinc-50 border-t border-zinc-200">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-zinc-900 uppercase">
                        Used Cars Available in <span className="text-red-600">Your City</span>
                    </h2>
                    <p className="mt-3 text-zinc-600 max-w-2xl mx-auto">
                        We deliver top-quality inspected vehicles across key locations in Tamil Nadu. Find the best deals near you.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {serviceAreas.map((area, index) => (
                        <Link key={index} href={area.href} className="group block h-full">
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg hover:border-red-200 transition-all duration-300 h-full flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-red-600 transition-colors">
                                    Used Cars in {area.city}
                                </h3>
                                <p className="text-zinc-500 text-sm">
                                    {area.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
