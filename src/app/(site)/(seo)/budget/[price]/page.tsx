import type { Metadata } from 'next';
import { CarFilterService } from '@/services/filter/carFilter.service';
import { generateListingMetadata, generateProgrammaticContent, generateProgrammaticFaqs, generateFaqJsonLd } from '@/lib/seo/listing-seo';
import { parseSearchParams, parsePriceSlug, formatPriceLabel } from '@/lib/listing.utils';
import { SharedListingLayout } from '@/components/public/listing/SharedListingLayout';

const filterService = new CarFilterService(false);

interface PageProps {
    params: Promise<{ price: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { price } = await params;
    const raw = await searchParams;
    const priceMax = parsePriceSlug(price);
    const filters = parseSearchParams(raw, { priceMax });
    const result = await filterService.getPublicListing(filters);

    const hasComplexFilters = Object.keys(raw).some(k => k !== 'page');

    return generateListingMetadata({
        total: result.pagination.total,
        brands: raw.brand ? (Array.isArray(raw.brand) ? raw.brand : [raw.brand]) : [],
        priceMax,
        canonicalPath: `/used-cars-under-${price}`,
        page: raw.page ? Number(raw.page) : undefined,
    }, hasComplexFilters);
}

export default async function BudgetCarsPage({ params, searchParams }: PageProps) {
    const { price } = await params;
    const raw = await searchParams;
    const priceMax = parsePriceSlug(price);
    const priceLabel = formatPriceLabel(price);

    const seoInputs = { priceMax, total: 0 };
    const content = generateProgrammaticContent(seoInputs);
    const faqs = generateProgrammaticFaqs(seoInputs);
    const faqSchema = generateFaqJsonLd(faqs);

    const footerContent = content ? (
        <section className="bg-muted/30 p-8 rounded-xl border border-border mt-12">
            <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
                {content.text}
            </p>
        </section>
    ) : null;

    return (
        <SharedListingLayout
            searchParams={raw}
            filterOverrides={{ priceMax }}
            title={`Used Cars Under ${priceLabel}`}
            footerContent={footerContent}
            additionalJsonLd={[faqSchema]}
        />
    );
}
