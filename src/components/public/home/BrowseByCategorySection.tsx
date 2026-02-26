import Link from 'next/link';

const categories = [
    { title: 'SUVs', slug: '/buy-cars?bodyType=suv' },
    { title: 'Sedans', slug: '/buy-cars?bodyType=sedan' },
    { title: 'Hatchbacks', slug: '/buy-cars?bodyType=hatchback' },
    { title: 'Automatic', slug: '/buy-cars?transmission=automatic' },
    { title: 'Manual', slug: '/buy-cars?transmission=manual' },
    { title: 'Petrol Cars', slug: '/buy-cars?fuel=petrol' },
    { title: 'Diesel Cars', slug: '/buy-cars?fuel=diesel' },
    { title: 'Car Buying Tips', slug: '/blog' },
];

export function BrowseByCategorySection() {
    return (
        <section className="py-12 bg-card border-y border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-bold mb-6 text-foreground text-center sm:text-left">
                    Popular Searches
                </h2>

                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={cat.slug}
                            className="inline-flex px-4 py-2 bg-muted/50 text-foreground text-sm font-medium rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {cat.title}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
