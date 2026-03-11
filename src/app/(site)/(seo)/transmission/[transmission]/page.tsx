import type { Metadata } from 'next';
import { CarFilterService } from '@/services/filter/carFilter.service';
import { generateListingMetadata, generateProgrammaticContent, generateProgrammaticFaqs, generateFaqJsonLd } from '@/lib/seo/listing-seo';
import { parseSearchParams } from '@/lib/listing.utils';
import { SharedListingLayout } from '@/components/public/listing/SharedListingLayout';

const filterService = new CarFilterService(false);

interface PageProps {
    params: Promise<{ transmission: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { transmission } = await params;
    const raw = await searchParams;
    const filters = parseSearchParams(raw, { transmission: [transmission] });
    const result = await filterService.getPublicListing(filters);

    const hasComplexFilters = Object.keys(raw).some(k => k !== 'page');

    return generateListingMetadata({
        total: result.pagination.total,
        brands: raw.brand ? (Array.isArray(raw.brand) ? raw.brand : [raw.brand]) : [],
        canonicalPath: `/used-${transmission}-cars`,
        page: raw.page ? Number(raw.page) : undefined,
    }, hasComplexFilters);
}

export default async function TransmissionCarsPage({ params, searchParams }: PageProps) {
    const { transmission } = await params;
    const raw = await searchParams;
    const transmissionName = transmission.charAt(0).toUpperCase() + transmission.slice(1);

    const seoInputs = { transmission, total: 0 };
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
            filterOverrides={{ transmission: [transmission] }}
            title={`Used ${transmissionName} Cars`}
            footerContent={footerContent}
            additionalJsonLd={[faqSchema]}
        />
    );
}
