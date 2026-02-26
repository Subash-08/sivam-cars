import Image from 'next/image';
import { siteConfig } from '@/config/site';
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
            className="relative min-h-[90vh] flex flex-col justify-center items-center bg-background overflow-hidden"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <Image
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=3666&auto=format&fit=crop"
                    alt="Luxury cars lined up"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                {/* Dark overlay for contrast */}
                <div className="absolute inset-0 bg-background/80 md:bg-background/70 backdrop-blur-[2px]"></div>
            </div>

            {/* Top red bar — automotive accent line */}
            <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-1 bg-primary pointer-events-none z-10"
            />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-col items-center justify-center text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-background/60 backdrop-blur-md border border-primary/30 rounded-full px-4 py-1.5 mb-7 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                            Trusted Single Dealer · Chennai
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight text-balance">
                        Find Your Perfect{' '}
                        <span className="text-gradient-brand">
                            Pre-Owned Car
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-6 text-lg text-foreground/90 font-medium leading-relaxed max-w-2xl text-balance drop-shadow-md">
                        {siteConfig.description}
                    </p>

                </div>

                {/* Main Filter Search Card */}
                <HeroSearchForm brands={activeBrands} />

            </div>
        </section>
    );
}
