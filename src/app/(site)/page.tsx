import type { Metadata } from 'next';
import Script from 'next/script';
import HeroSection from '@/components/hero/HeroSection';
import { HomeService } from '@/services/public/home.service';
import { VideoSectionService } from '@/services/public/videoSection.service';
import { siteConfig } from '@/config/site';

// Sections
import PopularBrandsSection from '@/components/public/home/PopularBrandsSection';
import { InventoryDepthSection } from '@/components/public/home/InventoryDepthSection';
import { WhyChooseUsSection } from '@/components/public/home/WhyChooseUsSection';
import { BuyingProcessSection } from '@/components/public/home/BuyingProcessSection';
import PrimaryCTASection from '@/components/public/shared/PrimaryCTASection';
import TestimonialsSection from '@/components/public/home/TestimonialsSection';
import FAQSection from '@/components/public/home/FAQSection';
import { HomeShowcaseSection } from '@/components/public/home/HomeShowcaseSection';
import VideoShowcaseSection from '@/components/public/home/VideoShowcaseSection';
import CustomerStoriesSection from '@/components/public/home/CustomerStoriesSection';

import ServiceAreaSection from '@/components/public/home/ServiceAreaSection';
import PopularSearchesSection from '@/components/public/home/PopularSearchesSection';

export const metadata: Metadata = {
    title: `Used Cars in Kallakurichi | Second Hand Cars in Attur & Salem | ${siteConfig.name}`,
    description: siteConfig.description,
    openGraph: {
        title: `Used Cars in Kallakurichi | Second Hand Cars in Attur & Salem | ${siteConfig.name}`,
        description: siteConfig.description,
        url: siteConfig.url,
        images: siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : [],
    },
    alternates: {
        canonical: siteConfig.url,
        languages: {
            'en-IN': siteConfig.url,
        },
    },
    twitter: {
        card: 'summary_large_image',
        title: `Used Cars in Kallakurichi | Second Hand Cars | ${siteConfig.name}`,
        description: 'Buy verified used cars in Kallakurichi, Attur and Salem from SivamCars.',
        images: siteConfig.ogImage ? [siteConfig.ogImage] : [],
    },
};

export default async function HomePage() {
    const homeService = new HomeService();
    const videoSectionService = new VideoSectionService();

    // ── Parallel Data Fetching ───────────────────────────────────────────────
    const [featuredCars, totalActiveCars, homeSections, videoSections, customerStories, homepageBrands] = await Promise.all([
        homeService.getFeaturedCars(),
        homeService.getTotalActiveCarsCount(),
        homeService.getActiveHomeSections(),
        videoSectionService.getActiveVideoSections(),
        homeService.getActiveCustomerStories(),
        homeService.getHomepageBrands(),
    ]);

    // ── Structured Data (JSON-LD) ───────────────────────────────────────────
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${siteConfig.url}/#organization`,
                name: siteConfig.name,
                url: siteConfig.url,
                logo: `${siteConfig.url}/logo.png`,
                sameAs: [
                    siteConfig.social.facebook,
                    siteConfig.social.instagram,
                    siteConfig.social.youtube,
                ].filter(Boolean),
            },
            {
                '@type': 'AutoDealer',
                '@id': `${siteConfig.url}/#business`,
                name: siteConfig.name,
                url: siteConfig.url,
                logo: `${siteConfig.url}/logo.png`,
                description: siteConfig.description,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: siteConfig.address,
                    addressLocality: 'Kallakurichi',
                    addressRegion: 'Tamil Nadu',
                    postalCode: '606213',
                    addressCountry: 'IN',
                },
                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: '11.7381',
                    longitude: '78.9634',
                },
                areaServed: ['Kallakurichi', 'Attur', 'Salem', 'Ulundurpet'],
                openingHours: 'Mo-Sa 09:00-19:00',
                priceRange: '₹1,00,000 - ₹50,00,000',
                telephone: siteConfig.phone,
                sameAs: [
                    siteConfig.social.facebook,
                    siteConfig.social.instagram,
                    siteConfig.social.youtube,
                ].filter(Boolean),
            },
            {
                '@type': 'WebSite',
                '@id': `${siteConfig.url}/#website`,
                url: siteConfig.url,
                name: siteConfig.name,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${siteConfig.url}/used-cars?search={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${siteConfig.url}/#breadcrumb`,
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: siteConfig.url,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Used Cars',
                        item: `${siteConfig.url}/used-cars`,
                    },
                ],
            },
            {
                '@type': 'ItemList',
                '@id': `${siteConfig.url}/#featured-cars`,
                name: 'Featured Cars',
                itemListElement: featuredCars.map((car, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                        '@type': 'Vehicle',
                        url: `${siteConfig.url}/cars/${car.slug}`,
                        name: `${car.brand?.name} ${car.name}`,
                        image: car.images?.[0]?.url,
                        description: `Year: ${car.year}, Fuel: ${car.fuelType}, KMs: ${car.kmsDriven}`,
                        brand: {
                            '@type': 'Brand',
                            name: car.brand?.name,
                        },
                        vehicleModelDate: car.year?.toString(),
                        mileageFromOdometer: {
                            '@type': 'QuantitativeValue',
                            value: car.kmsDriven,
                            unitCode: 'KMT',
                        },
                        fuelType: car.fuelType,
                        vehicleTransmission: car.transmission,
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



                {/* Dynamic Showcase Sections (admin-managed) */}
                {homeSections.map((section, idx) => (
                    <HomeShowcaseSection
                        key={section._id}
                        title={section.title}
                        subtitle={section.subtitle}
                        layoutType={section.layoutType}
                        viewAllText={section.viewAllText}
                        viewAllLink={section.viewAllLink}
                        cars={section.cars}
                        priorityImages={idx === 0}
                    />
                ))}


                {/* Popular Brands Section */}
                <PopularBrandsSection brands={homepageBrands} />

                <InventoryDepthSection totalCars={totalActiveCars} />

                <PopularSearchesSection />
                {/* Internal Linking & Static Funnel/Trust Builders */}
                {/* <BrowseByCategorySection /> */}

                {/* Local SEO Additions */}
                {/* <LocalSEOContentBlock /> */}
                <WhyChooseUsSection />
                <BuyingProcessSection />
                <ServiceAreaSection />
                <CustomerStoriesSection stories={customerStories} />

                <PrimaryCTASection />  {/* Video Showcase Sections */}
                {videoSections.map((section) => (
                    <VideoShowcaseSection key={section._id} section={section as any} />
                ))}
                <TestimonialsSection />
                <FAQSection />

                {/* Local SEO Contextual Text */}
                {/* <SeoFooterSection /> */}
            </main>
        </>
    );
}
