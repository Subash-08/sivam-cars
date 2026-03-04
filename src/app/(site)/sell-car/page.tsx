import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import HeroSection from '@/components/public/sell-car/HeroSection';
import ProcessSection from '@/components/public/sell-car/ProcessSection';
import ValuationSection from '@/components/public/sell-car/ValuationSection';
import WhyChooseSection from '@/components/public/sell-car/WhyChooseSection';
import RecentSalesSection from '@/components/public/sell-car/RecentSalesSection';
import FAQSection from '@/components/public/sell-car/FAQSection';
import PrimaryCTASection from '@/components/public/shared/PrimaryCTASection';

// ─── Metadata ─────────────────────────────────────────────────────────────────

const pageTitle = 'Sell Your Used Car at Best Price — SivamCars';
const pageDescription =
    'Sell your used car in Salem at the best market price. Free doorstep inspection, instant valuation, same-day payment. Zero commission, free RC transfer.';
const canonicalUrl = `${siteConfig.url}/sell-car`;

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords: [
        'sell used car in Salem',
        'best price for used car',
        'instant car valuation',
        'sell car online',
        'sell car Salem Tamil Nadu',
        'free car inspection',
        'same day car payment',
    ],
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: canonicalUrl,
        siteName: siteConfig.name,
        type: 'website',
        locale: 'en_IN',
    },
    twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
    },
};

// ─── Brands List (passed to form) ────────────────────────────────────────────

const CAR_BRANDS = [
    'Maruti Suzuki',
    'Hyundai',
    'Tata',
    'Mahindra',
    'Kia',
    'Toyota',
    'Honda',
    'MG',
    'Skoda',
    'Volkswagen',
    'Renault',
    'Nissan',
    'Ford',
    'Chevrolet',
    'Jeep',
    'BMW',
    'Mercedes-Benz',
    'Audi',
] as const;

// ─── FAQ Data (for JSON-LD) ──────────────────────────────────────────────────

const faqJsonLd = {
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How long does the payment take?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'We transfer the money instantly to your bank account via IMPS/RTGS as soon as you sign the agreement. It typically takes 15-30 minutes.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is the inspection really free?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, our doorstep inspection is 100% free with no obligation to sell. You can choose to decline our offer if you are not satisfied.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I sell a financed car?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Absolutely! We handle the loan foreclosure process for you. We will pay the bank directly and transfer the remaining balance to you.',
            },
        },
        {
            '@type': 'Question',
            name: 'Do you charge any commission?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No, we do not charge any commission or service fee from the seller. The price we offer is the net amount you receive.',
            },
        },
        {
            '@type': 'Question',
            name: 'What documents are required?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You will need the RC (Registration Certificate), Insurance policy, PUC certificate, and your KYC documents (Aadhar/PAN).',
            },
        },
    ],
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function JsonLdSchema(): React.JSX.Element {
    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'LocalBusiness',
                name: siteConfig.name,
                url: siteConfig.url,
                telephone: siteConfig.phone,
                email: siteConfig.email,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: siteConfig.address,
                    addressLocality: 'Salem',
                    addressRegion: 'Tamil Nadu',
                    addressCountry: 'IN',
                },
            },
            {
                '@type': 'Service',
                name: 'Sell Used Car',
                description: pageDescription,
                provider: {
                    '@type': 'LocalBusiness',
                    name: siteConfig.name,
                },
                areaServed: {
                    '@type': 'City',
                    name: 'Salem',
                },
                serviceType: 'Used Car Purchase',
            },
            faqJsonLd,
            {
                '@type': 'BreadcrumbList',
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
                        name: 'Sell Your Car',
                        item: canonicalUrl,
                    },
                ],
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellCarPage(): React.JSX.Element {
    return (
        <>
            <JsonLdSchema />
            <main>
                <HeroSection brands={[...CAR_BRANDS]} />
                <ProcessSection />
                <ValuationSection />
                <WhyChooseSection />
                <RecentSalesSection />
                <FAQSection />
                <PrimaryCTASection />
            </main>
        </>
    );
}
