import type { Metadata } from 'next';
import Script from 'next/script';
import { siteConfig } from '@/config/site';

import AboutHeroSection from '@/components/public/about/HeroSection';
import OurStorySection from '@/components/public/about/OurStorySection';
import DifferentiatorSection from '@/components/public/about/DifferentiatorSection';
import ProcessSection from '@/components/public/about/ProcessSection';
import TrustSection from '@/components/public/about/TrustSection';
import AboutLocationSection from '@/components/public/about/LocationSection';
import PrimaryCTASection from '@/components/public/shared/PrimaryCTASection';

export function generateMetadata(): Metadata {
    return {
        title: `About ${siteConfig.name} | Trusted Used Car Dealer in Salem`,
        description:
            'Learn more about Sivam Cars, your trusted used car dealer in Salem offering quality inspected vehicles with transparent pricing.',
        openGraph: {
            title: `About ${siteConfig.name} | Trusted Used Car Dealer in Salem`,
            description:
                'Learn more about Sivam Cars, your trusted used car dealer in Salem offering quality inspected vehicles with transparent pricing.',
            url: `${siteConfig.url}/about`,
            type: 'website',
        },
        alternates: {
            canonical: `${siteConfig.url}/about`,
        },
    };
}

export default function AboutPage(): React.JSX.Element {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${siteConfig.url}/#organization`,
                name: siteConfig.name,
                url: siteConfig.url,
                logo: `${siteConfig.url}/logo.png`,
                description: siteConfig.description,
                contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: siteConfig.phone,
                    contactType: 'customer service',
                    areaServed: 'IN',
                    availableLanguage: 'English',
                },
                sameAs: [
                    siteConfig.social.facebook,
                    siteConfig.social.instagram,
                    siteConfig.social.youtube,
                ].filter(Boolean),
            },
            {
                '@type': 'LocalBusiness',
                '@id': `${siteConfig.url}/#localbusiness`,
                name: siteConfig.name,
                url: `${siteConfig.url}/about`,
                description: siteConfig.description,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: siteConfig.address,
                    addressLocality: 'Salem',
                    addressRegion: 'Tamil Nadu',
                    addressCountry: 'IN',
                },
                telephone: siteConfig.phone,
                email: siteConfig.email,
                openingHours: siteConfig.workingHours,
                image: `${siteConfig.url}/logo.png`,
            },
            {
                '@type': 'AboutPage',
                '@id': `${siteConfig.url}/about/#aboutpage`,
                name: `About ${siteConfig.name}`,
                url: `${siteConfig.url}/about`,
                description: `Learn about ${siteConfig.name}, a trusted single-dealer used car platform in Salem, Tamil Nadu.`,
                isPartOf: {
                    '@id': `${siteConfig.url}/#organization`,
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${siteConfig.url}/about/#breadcrumb`,
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
                        name: 'About',
                        item: `${siteConfig.url}/about`,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <Script
                id="about-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <AboutHeroSection />
            <OurStorySection />
            <DifferentiatorSection />
            <ProcessSection />
            <TrustSection />
            <AboutLocationSection />
            <PrimaryCTASection />
        </>
    );
}
