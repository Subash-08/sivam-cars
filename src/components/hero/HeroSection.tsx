import Image from "next/image";
import { CarFilterService } from "@/services/filter/carFilter.service";
import { HeroSettingService } from "@/services/public/heroSetting.service";
import { HeroSearchForm } from "./HeroSearchForm";
import HeroText from "./HeroText";

export default async function HeroSection() {
    const carService = new CarFilterService();
    const heroSettingService = new HeroSettingService();

    const [stats, heroSettings] = await Promise.all([
        carService.getFilterStats({ isActive: true, isDeleted: false, isSold: false }),
        heroSettingService.getSettings(),
    ]);

    const activeBrands = stats.brands.map((b) => ({
        _id: b._id,
        name: b.name,
        slug: b.slug,
        count: b.count,
    }));

    return (
        <section
            aria-label="Used Cars Hero"
            className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 z-0 bg-[#0f1115]">
                <Image
                    src={heroSettings.backgroundImage}
                    alt={heroSettings.backgroundImageAlt}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />

                {/* softer overlay so cars remain visible */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* red glow accent */}
                <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-red-500/20 blur-[150px] rounded-full"></div>
            </div>

            {/* Content container */}
            <div className="relative z-10 w-[90%] lg:w-[80%] mx-auto flex flex-col items-center text-center py-16">

                {/* Animated Hero Text */}
                <HeroText
                    badgeText={heroSettings.badgeText}
                    headingPrimary={heroSettings.headingPrimary}
                    headingSecondary={heroSettings.headingSecondary}
                    description={heroSettings.description}
                    trustIndicators={heroSettings.trustIndicators}
                />

                {/* Search */}
                <div className="mt-10 w-full max-w-5xl">
                    <div className="rounded-2xl border border-white/10 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/30 p-4 sm:p-6">
                        <HeroSearchForm brands={activeBrands} />
                    </div>
                </div>

            </div>
        </section>
    );
}