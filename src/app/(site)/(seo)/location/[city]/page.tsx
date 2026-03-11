import type { Metadata } from 'next';
import { CarFilterService } from '@/services/filter/carFilter.service';
import { generateListingMetadata, generateLocalBusinessJsonLd, generateProgrammaticFaqs, generateFaqJsonLd } from '@/lib/seo/listing-seo';
import { parseSearchParams } from '@/lib/listing.utils';
import { SharedListingLayout } from '@/components/public/listing/SharedListingLayout';

const filterService = new CarFilterService(false);

interface PageProps {
    params: Promise<{ city: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { city } = await params;
    const raw = await searchParams;
    const filters = parseSearchParams(raw, { city });
    const result = await filterService.getPublicListing(filters);
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);

    return generateListingMetadata({
        total: result.pagination.total,
        brands: raw.brand ? (Array.isArray(raw.brand) ? raw.brand : [raw.brand]) : [],
        canonicalPath: `/used-cars-in-${city}`,
        page: raw.page ? Number(raw.page) : undefined,
        title: `Used Cars in ${cityName} | Second Hand Cars for Sale | SivamCars`,
        description: `Browse verified used cars available for buyers in ${cityName}. Explore SUVs, sedans, and hatchbacks with easy EMI options.`,
    });
}

export default async function CityCarsPage({ params, searchParams }: PageProps) {
    const { city } = await params;
    const raw = await searchParams;
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);

    const localSchema = generateLocalBusinessJsonLd(cityName);
    const faqs = generateProgrammaticFaqs({ city, total: 0 });
    const faqSchema = generateFaqJsonLd(faqs);

    const footerContent = (
        <section className="bg-muted/30 p-8 rounded-xl border border-border mt-12">
            <h2 className="text-2xl font-bold mb-4">Why Buy Used Cars in {cityName}?</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
                SivamCars serves customers in {cityName} and nearby areas with verified pre-owned cars. Browse fully inspected vehicles across all brands with transparent pricing and easy financing options.
            </p>
        </section>
    );

    return (
        <SharedListingLayout
            searchParams={raw}
            filterOverrides={{ city }}
            title={`Used Cars in ${cityName}`}
            footerContent={footerContent}
            additionalJsonLd={[localSchema, faqSchema]}
        />
    );
}
