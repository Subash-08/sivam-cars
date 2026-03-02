import Image from 'next/image';
import { CarFilterService } from '@/services/filter/carFilter.service';
import { HeroSearchForm } from './HeroSearchForm';

export default async function HeroSection() {
    // Fetch active brands for the search form
    const carService = new CarFilterService();
    const stats = await carService.getFilterStats({ isActive: true, isDeleted: false, isSold: false });

    // Ensure we only pass the necessary data to the Client Component
    const activeBrands = stats.brands.map(b => ({
        _id: b._id,
        name: b.name,
        slug: b.slug,
        count: b.count
    }));

    return (
        <section
            aria-label="Hero"
            className="relative min-h-[85vh] flex flex-col justify-end items-center bg-background overflow-hidden pb-12"
        >
            {/* Background Image with Bottom Gradient Overlay */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <Image
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=3666&auto=format&fit=crop"
                    alt="Luxury cars lined up"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-bottom"
                />
                {/* Gradient overlay to make bottom text and search form pop while keeping the sky clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-end text-center pt-32">


                {/* Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight text-balance mb-2 drop-shadow-md">
                    Find your perfect new or used car
                </h1>

                {/* Main Filter Search Card (Kept exactly as requested) */}
                <div className="w-full flex justify-center">
                    <HeroSearchForm brands={activeBrands} />
                </div>

            </div>
        </section>
    );
}