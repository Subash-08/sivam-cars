import type { Metadata } from 'next';
import { CarFilterService } from '@/services/filter/carFilter.service';
import { generateListingMetadata } from '@/lib/seo/listing-seo';
import { parseSearchParams } from '@/lib/listing.utils';
import { SharedListingLayout } from '@/components/public/listing/SharedListingLayout';

const filterService = new CarFilterService(false);

interface PageProps {
    params: Promise<{ year: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { year } = await params;
    const raw = await searchParams;
    const yearNum = parseInt(year, 10);
    const filters = parseSearchParams(raw, { yearMin: yearNum, yearMax: yearNum });
    const result = await filterService.getPublicListing(filters);

    const hasComplexFilters = Object.keys(raw).some(k => k !== 'page');

    return generateListingMetadata({
        total: result.pagination.total,
        brands: raw.brand ? (Array.isArray(raw.brand) ? raw.brand : [raw.brand]) : [],
        canonicalPath: `/${year}-used-cars`,
        page: raw.page ? Number(raw.page) : undefined,
    }, hasComplexFilters);
}

export default async function YearCarsPage({ params, searchParams }: PageProps) {
    const { year } = await params;
    const raw = await searchParams;
    const yearNum = parseInt(year, 10);

    return (
        <SharedListingLayout
            searchParams={raw}
            filterOverrides={{ yearMin: yearNum, yearMax: yearNum }}
            title={`${year} Used Cars`}
        />
    );
}
