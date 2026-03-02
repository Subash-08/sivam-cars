import type { Metadata } from 'next';
import Script from 'next/script';
import { siteConfig } from '@/config/site';

import ContactHeroSection from '@/components/public/contact/ContactHeroSection';
import ContactInfoSection from '@/components/public/contact/ContactInfoSection';
import ContactForm from '@/components/public/contact/ContactForm';
import ContactMapSection from '@/components/public/contact/ContactMapSection';
import ContactFaqSection from '@/components/public/contact/ContactFaqSection';
import ContactCtaSection from '@/components/public/contact/ContactCtaSection';

export function generateMetadata(): Metadata {
    return {
        title: `Contact ${siteConfig.name} | Used Car Dealer in Salem`,
        description:
            'Contact Sivam Cars for quality inspected used cars in Salem. Call, WhatsApp, or send us a message today.',
        openGraph: {
            title: `Contact ${siteConfig.name} | Used Car Dealer in Salem`,
            description:
                'Contact Sivam Cars for quality inspected used cars in Salem. Call, WhatsApp, or send us a message today.',
            url: `${siteConfig.url}/contact`,
            type: 'website',
        },
        alternates: {
            canonical: `${siteConfig.url}/contact`,
        },
    };
}

export default function ContactPage(): React.JSX.Element {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'LocalBusiness',
                '@id': `${siteConfig.url}/#localbusiness`,
                name: siteConfig.name,
                url: siteConfig.url,
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
                '@type': 'ContactPoint',
                '@id': `${siteConfig.url}/contact/#contactpoint`,
                telephone: siteConfig.phone,
                email: siteConfig.email,
                contactType: 'customer service',
                areaServed: 'IN',
                availableLanguage: 'English',
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${siteConfig.url}/contact/#breadcrumb`,
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
                        name: 'Contact',
                        item: `${siteConfig.url}/contact`,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <Script
                id="contact-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ContactHeroSection />
            <ContactInfoSection />

            {/* Form Section */}
            <section className="bg-muted py-16 md:py-24">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <ContactForm />
                </div>
            </section>

            <ContactMapSection />
            <ContactFaqSection />
            <ContactCtaSection />
        </>
    );
}
