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
        params.set("page", "1"); // Always reset to page 1

        if (brand) {
            params.set("brand", brand);
        }

        // Validate year range before pushing
        let min = yearMin ? parseInt(yearMin) : NaN;
        let max = yearMax ? parseInt(yearMax) : NaN;

        if (!isNaN(min) && !isNaN(max) && min > max) {
            [min, max] = [max, min]; // Swap if min > max
        }

        if (!isNaN(min)) params.set("yearMin", min.toString());
        if (!isNaN(max)) params.set("yearMax", max.toString());

        router.push(`/buy-cars?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 relative z-10">
            <div className="bg-card/95 backdrop-blur-md border border-border-strong rounded-2xl p-6 card-elevated shadow-2xl">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">

                    {/* Vehicle Type (Static) */}
                    <div className="flex-1 w-full">
                        <label htmlFor="vehicle-type" className="block text-sm font-medium text-foreground mb-2">
                            Vehicle Type
                        </label>
                        <select
                            id="vehicle-type"
                            className="w-full bg-input border border-border rounded-lg py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                            defaultValue="used"
                        >
                            <option value="used">Used Cars</option>
                        </select>
                    </div>

                    {/* Make (Brand) */}
                    <div className="flex-1 w-full relative">
                        <label htmlFor="make" className="block text-sm font-medium text-foreground mb-2">
                            Make
                        </label>
                        <select
                            id="make"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full bg-input border border-border rounded-lg py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                        >
                            <option value="">All Brands</option>
                            {brands.map((b) => (
                                <option key={b._id} value={b.slug}>
                                    {b.name} ({b.count})
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 top-7 flex items-center px-4 pointer-events-none text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Year Range */}
                    <div className="flex-[1.5] w-full items-end gap-2 flex">
                        <div className="flex-1">
                            <label htmlFor="yearMin" className="block text-sm font-medium text-foreground mb-2 whitespace-nowrap">
                                Year (Min - Max)
                            </label>
                            <input
                                type="number"
                                id="yearMin"
                                placeholder="e.g. 2018"
                                value={yearMin}
                                min="1990"
                                max={currentYear}
                                onChange={(e) => setYearMin(e.target.value)}
                                className="w-full bg-input border border-border rounded-lg py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="flex-1">
                            {/* Hidden label to keep alignment */}
                            <label htmlFor="yearMax" className="block text-sm font-medium text-transparent mb-2 select-none">
                                Max
                            </label>
                            <input
                                type="number"
                                id="yearMax"
                                placeholder={`e.g. ${currentYear}`}
                                value={yearMax}
                                min="1990"
                                max={currentYear}
                                onChange={(e) => setYearMax(e.target.value)}
                                className="w-full bg-input border border-border rounded-lg py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="w-full md:w-auto mt-4 md:mt-0">
                        <button
                            type="submit"
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-all duration-200 glow-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background h-[50px]"
                        >
                            <Search className="w-5 h-5" />
                            <span>Search</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
