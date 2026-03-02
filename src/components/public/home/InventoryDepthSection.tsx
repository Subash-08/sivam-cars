import Link from 'next/link';
import { CarFront, Sparkles, ArrowRight } from 'lucide-react';

export function InventoryDepthSection({ totalCars }: { totalCars: number }) {
    if (!totalCars || totalCars === 0) return null;

    return (
        <section className="relative py-16 lg:py-20 overflow-hidden bg-black text-primary-foreground shadow-inner">
            {/* Subtle Animated Background Glows */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

                    {/* Left Content Area */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left w-full lg:w-auto">

                        {/* Icon Container with Hover Lift */}
                        <div className="relative group shrink-0 mt-2">
                            {/* Glow behind the icon */}
                            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md group-hover:bg-white/30 transition-all duration-500" />

                            {/* Glassmorphism Icon Box */}
                            <div className="relative p-5 bg-white/10 border border-white/20 rounded-2xl transform group-hover:-translate-y-2 transition-transform duration-300 shadow-xl backdrop-blur-sm">
                                <CarFront className="w-10 h-10 text-white" />
                                {/* Pulsing Sparkle Accent */}
                                <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-red-400 animate-pulse drop-shadow-md" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-3">
                            <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm backdrop-blur-sm text-red">
                                Massive Selection
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 drop-shadow-sm">Premium</span> quality vehicles
                            </h2>

                            <p className="text-primary-foreground/90 text-lg sm:text-xl max-w-2xl font-medium leading-relaxed drop-shadow-sm">
                                Skip the wait. Find a certified, pre-owned car that perfectly fits your lifestyle and budget today.
                            </p>
                        </div>
                    </div>

                    {/* Interactive CTA Button */}
                    <Link
                        href="/used-cars?page=1"
                        className="group w-full sm:w-auto bg-background text-foreground font-bold px-8 py-4 sm:px-10 sm:py-5 rounded-xl shadow-2xl hover:shadow-xl hover:bg-background/90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shrink-0"
                    >
                        <span>Browse Inventory</span>
                        {/* Arrow animates slightly to the right on hover */}
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform duration-300 text-primary" />
                    </Link>
                </div>
            </div>
        </section>
    );
}