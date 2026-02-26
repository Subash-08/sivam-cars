import Link from 'next/link';
import Image from 'next/image';

interface BrandStat {
    _id: string;
    name: string;
    slug: string;
    count: number;
    logo?: string;
}

export function BrandSection({ brands }: { brands: BrandStat[] }) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Row */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground">Browse by Brand</h2>
                        <p className="mt-2 text-muted-foreground">Explore our extensive collection by top manufacturers</p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {brands.map((brand) => (
                        <Link
                            key={brand._id}
                            href={`/buy-cars?page=1&brand=${brand.slug}`}
                            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl transition-all duration-200 hover:border-primary/50 hover:shadow-md group"
                        >
                            {/* Logo Wrapper */}
                            <div className="w-16 h-16 relative mb-4 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                {brand.logo ? (
                                    <Image
                                        src={brand.logo}
                                        alt={`${brand.name} logo`}
                                        fill
                                        className="object-contain"
                                        sizes="64px"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted rounded-full flex items-center justify-center text-xl font-bold text-muted-foreground">
                                        {brand.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <h3 className="font-semibold text-foreground">{brand.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{brand.count} Cars</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
