"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface Brand {
    _id: string;
    name: string;
    slug: string;
    count: number;
}

interface HeroSearchFormProps {
    brands: Brand[];
}

export function HeroSearchForm({ brands }: HeroSearchFormProps) {
    const router = useRouter();

    const [brand, setBrand] = useState("");
    const [yearMin, setYearMin] = useState("");
    const [yearMax, setYearMax] = useState("");

    const currentYear = new Date().getFullYear();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();
        params.set("page", "1");

        if (brand) params.set("brand", brand);

        let min = yearMin ? parseInt(yearMin) : NaN;
        let max = yearMax ? parseInt(yearMax) : NaN;

        if (!isNaN(min) && !isNaN(max) && min > max) {
            [min, max] = [max, min];
        }

        if (!isNaN(min)) params.set("yearMin", min.toString());
        if (!isNaN(max)) params.set("yearMax", max.toString());

        router.push(`/used-cars?${params.toString()}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
            {/* Brand */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Brand
                </label>

                <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                >
                    <option value="">All Brands</option>

                    {brands.map((b) => (
                        <option key={b._id} value={b.slug}>
                            {b.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Year Min */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Min Year
                </label>

                <input
                    type="number"
                    placeholder="2018"
                    value={yearMin}
                    min="1990"
                    max={currentYear}
                    onChange={(e) => setYearMin(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                />
            </div>

            {/* Year Max */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Max Year
                </label>

                <input
                    type="number"
                    placeholder={currentYear.toString()}
                    value={yearMax}
                    min="1990"
                    max={currentYear}
                    onChange={(e) => setYearMax(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                />
            </div>

            {/* Search Button */}
            <div>
                <button
                    type="submit"
                    className="w-full h-[50px] flex items-center justify-center gap-2
          bg-primary text-white font-semibold rounded-xl
          hover:scale-[1.02] hover:shadow-lg
          active:scale-[0.98]
          transition-all duration-200"
                >
                    <Search size={18} />
                    Search Cars
                </button>
            </div>
        </form>
    );
}