import Link from 'next/link';
import { CarCard } from '@/components/public/listing/CarCard';
import type { ListingCar } from '@/types/listing.types';

export function RecentCarsSection({ cars }: { cars: ListingCar[] }) {
    if (!cars || cars.length === 0) return null;

    return (
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Row */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground">Recently Added Inventory</h2>
                        <p className="mt-2 text-muted-foreground">Fresh arrivals ready for a test drive</p>
                    </div>
                    <Link
                        href="/buy-cars?page=1&sort=newest"
                        className="hidden sm:inline-flex text-primary font-semibold hover:text-primary-hover transition-colors items-center gap-1"
                    >
                        View All Inventory
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car, idx) => (
                        <CarCard key={car._id} car={car} priority={idx < 3} />
                    ))}
                </div>

                {/* Mobile View All button */}
                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href="/buy-cars?page=1&sort=newest"
                        className="inline-flex w-full justify-center items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold px-6 py-3 rounded-lg transition-all"
                    >
                        View All Inventory
                    </Link>
                </div>
            </div>
        </section>
    );
}
