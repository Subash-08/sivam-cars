import { siteConfig } from '@/config/site';

export function SeoFooterSection() {
    return (
        <section className="py-12 bg-muted/10 border-t border-border mt-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                    Your Trusted Partner for Quality Pre-Owned Cars
                </h2>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
                    <p>
                        Searching for reliable used cars doesn’t have to be complicated. At {siteConfig.name}, we pride ourselves on offering a meticulously inspected selection of pre-owned vehicles tailored to every lifestyle and budget. Whether you need a spacious SUV for family trips, a fuel-efficient hatchback for city commuting, or a premium sedan for business travel, our inventory is curated to meet stringent quality standards.
                    </p>
                    <p>
                        As a dedicated single-owner dealership serving the region, we prioritize transparency and customer satisfaction above all else. Every vehicle in our showroom comes with a detailed history, clear pricing, and complete documentation support. From browsing our latest arrivals to taking that test drive and finalizing the paperwork, our team is here to ensure a seamless car buying experience.
                    </p>
                </div>
            </div>
        </section>
    );
}
