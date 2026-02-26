import Link from 'next/link';
import { CarFront } from 'lucide-react';

export function InventoryDepthSection({ totalCars }: { totalCars: number }) {
    if (!totalCars || totalCars === 0) return null;

    return (
        <section className="py-12 bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6 text-left">
                        <div className="p-4 bg-background/10 rounded-full shrink-0">
                            <CarFront className="w-12 h-12" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-1">
                                Over {totalCars} quality pre-owned cars available
                            </h2>
                            <p className="text-primary-foreground/80 text-lg">
                                Skip the wait. Find a car that fits your lifestyle and budget today.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/buy-cars?page=1"
                        className="w-full md:w-auto text-center bg-background text-foreground font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-background/90 transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                        Browse Inventory
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
