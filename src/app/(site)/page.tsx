import type { Metadata } from 'next';
import Script from 'next/script';
import HeroSection from '@/components/hero/HeroSection';
import { HomeService } from '@/services/public/home.service';
import { siteConfig } from '@/config/site';

// Sections
import { FeaturedSection } from '@/components/public/home/FeaturedSection';
import { BrandSection } from '@/components/public/home/BrandSection';
import { RecentCarsSection } from '@/components/public/home/RecentCarsSection';
import { InventoryDepthSection } from '@/components/public/home/InventoryDepthSection';
import { BrowseByCategorySection } from '@/components/public/home/BrowseByCategorySection';
import { WhyChooseUsSection } from '@/components/public/home/WhyChooseUsSection';
import { BuyingProcessSection } from '@/components/public/home/BuyingProcessSection';
import { LocationSection } from '@/components/public/home/LocationSection';
import { SeoFooterSection } from '@/components/public/home/SeoFooterSection';

export const metadata: Metadata = {
    title: `${siteConfig.name} — ${siteConfig.tagline} | Quality Used Cars`,
    description: siteConfig.description,
    openGraph: {
        title: `${siteConfig.name} — Quality Pre-Owned Cars`,
        description: siteConfig.description,
        url: siteConfig.url,
    },
    alternates: {
        canonical: siteConfig.url,
    },
};

export default async function HomePage() {
    const homeService = new HomeService();

    // ── Parallel Data Fetching ───────────────────────────────────────────────
    const [featuredCars, recentCars, brands, totalActiveCars] = await Promise.all([
        homeService.getFeaturedCars(),
        homeService.getRecentCars(),
        homeService.getBrandsWithCounts(),
        homeService.getTotalActiveCarsCount(),
    ]);

    // ── Structured Data (JSON-LD) ───────────────────────────────────────────
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'LocalBusiness',
                '@id': `${siteConfig.url}/#business`,
                name: siteConfig.name,
                url: siteConfig.url,
                logo: `${siteConfig.url}/logo.png`, // Update if actual logo path differs
                description: siteConfig.description,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: siteConfig.address,
                    addressCountry: 'IN',
                },
                telephone: siteConfig.phone,
            },
            {
                '@type': 'WebSite',
                '@id': `${siteConfig.url}/#website`,
                url: siteConfig.url,
                name: siteConfig.name,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${siteConfig.url}/buy-cars?brand={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                },
            },
            {
                '@type': 'ItemList',
                '@id': `${siteConfig.url}/#featured-cars`,
                name: 'Featured Cars',
                itemListElement: featuredCars.map((car, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                        '@type': 'Product',
                        url: `${siteConfig.url}/cars/${car.slug}`,
                        name: `${car.brand?.name} ${car.name}`,
                        image: car.images?.[0]?.url,
                        description: `Year: ${car.year}, Fuel: ${car.fuelType}, KMs: ${car.kmsDriven}`,
                        offers: {
                            '@type': 'Offer',
                            price: car.price,
                            priceCurrency: 'INR',
                            availability: 'https://schema.org/InStock',
                            itemCondition: 'https://schema.org/UsedCondition',
                        },
                    },
                })),
            },
        ],
    };

    return (
        <>
            <Script
                id="home-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main>
                <HeroSection />

                {/* Dynamically Fetched DB Sections */}
                <BrandSection brands={brands} />
                <FeaturedSection cars={featuredCars} />
                <InventoryDepthSection totalCars={totalActiveCars} />
                <RecentCarsSection cars={recentCars} />

                {/* Internal Linking & Static Funnel/Trust Builders */}
                <BrowseByCategorySection />
                <WhyChooseUsSection />
                <BuyingProcessSection />
                <LocationSection />

                {/* Local SEO Contextual Text */}
                <SeoFooterSection />
            </main>
        </>
    );
}
