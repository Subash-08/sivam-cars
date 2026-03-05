import type { Metadata } from 'next';
import Script from 'next/script';
import { siteConfig } from '@/config/site';

import LoanHeroSection from '@/components/public/loan/HeroSection';
import LoanPartnersSection from '@/components/public/loan/LoanPartnersSection';
import EMICalculator from '@/components/public/loan/EMICalculator';
import LoanFeaturesSection from '@/components/public/loan/LoanFeaturesSection';
import EligibilitySection from '@/components/public/loan/EligibilitySection';
import RequiredDocumentsSection from '@/components/public/loan/RequiredDocumentsSection';
import LoanProcessSection from '@/components/public/loan/LoanProcessSection';
import LoanFAQSection from '@/components/public/loan/LoanFAQSection';
import LoanEnquiryForm from '@/components/public/loan/LoanEnquiryForm';
import PrimaryCTASection from '@/components/public/shared/PrimaryCTASection';

// ─── Metadata ─────────────────────────────────────────────────────────────────

const pageTitle = 'Car Loan for Used Cars | SivamCars';
const pageDescription =
    'Apply for affordable car loans with low interest rates from trusted partners like IDFC, IndusInd, Piramal, TVS Credit, and Cholamandalam.';
const canonicalUrl = `${siteConfig.url}/loan`;

export function generateMetadata(): Metadata {
    return {
        title: pageTitle,
        description: pageDescription,
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
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

// ─── FAQ Data (for JSON-LD) ──────────────────────────────────────────────────

const faqJsonLd = {
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What is the minimum down payment?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The minimum down payment is typically 10% of the car value. Some banks may offer up to 90% financing for eligible applicants.',
            },
        },
        {
            '@type': 'Question',
            name: 'How long does loan approval take?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most loan applications are processed within 24–48 hours. In many cases, you can receive approval within the same day.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I prepay my car loan?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, most lending partners allow part or full prepayment after a lock-in period of 6–12 months with minimal or zero penalty.',
            },
        },
        {
            '@type': 'Question',
            name: 'Do you provide loans for used cars?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, all our financing options are specifically tailored for pre-owned vehicles with competitive rates and tenure up to 7 years.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can self-employed people apply?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, self-employed individuals are eligible. You will need ITR returns, bank statements, and standard KYC documents.',
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
                name: 'Car Loan Assistance',
                description: pageDescription,
                provider: {
                    '@type': 'LocalBusiness',
                    name: siteConfig.name,
                },
                areaServed: {
                    '@type': 'City',
                    name: 'Salem',
                },
                serviceType: 'Car Loan Financing',
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
                        name: 'Car Loan',
                        item: canonicalUrl,
                    },
                ],
            },
        ],
    };

    return (
        <Script
            id="loan-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoanPage(): React.JSX.Element {
    return (
        <>
            <JsonLdSchema />

            <LoanHeroSection />
            <LoanPartnersSection />
            <EMICalculator />
            <LoanFeaturesSection />
            <EligibilitySection />
            <RequiredDocumentsSection />
            <LoanProcessSection />

            {/* Loan Enquiry Form */}
            <section
                id="loan-enquiry-form"
                className="bg-background py-16 md:py-24"
            >
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <LoanEnquiryForm />
                </div>
            </section>

            <PrimaryCTASection />
            <LoanFAQSection />
        </>
    );
}
