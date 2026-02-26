/**
 * src/lib/seo/listing-seo.ts — SEO helpers for /buy-cars page.
 *
 * Architecture: pure functions only — no DB, no HTTP.
 * Uses siteConfig for canonical URLs.
 */

import type { Metadata } from 'next';
import type { ListingCar, ListingFilters } from '@/types/listing.types';
import { siteConfig } from '@/config/site';

// ─── Metadata ─────────────────────────────────────────────────────────────────

interface MetadataInput {
    brands?: string[];
    priceMin?: number;
    priceMax?: number;
    total: number;
}

export function generateListingMetadata(input: MetadataInput): Metadata {
    let title = 'Buy Used Cars';

    if (input.brands && input.brands.length > 0) {
        const names = input.brands.slice(0, 3).join(', ');
        title = `Used ${names} Cars`;
    }

    if (input.priceMin && input.priceMax) {
        title += ` ₹${(input.priceMin / 100000).toFixed(0)}L–${(input.priceMax / 100000).toFixed(0)}L`;
    } else if (input.priceMax) {
        title += ` Under ₹${(input.priceMax / 100000).toFixed(0)}L`;
    }

    // Enforce 60-char limit
    if (title.length > 50) title = title.slice(0, 50);
    title += ` | ${siteConfig.name}`;

    const description = `Browse ${input.total} quality pre-owned cars at ${siteConfig.name}. Verified, inspected, and ready to drive.`;

    return {
        title,
        description: description.slice(0, 160),
        alternates: { canonical: '/buy-cars' },
        openGraph: {
            title,
            description: description.slice(0, 160),
            type: 'website',
            url: `${siteConfig.url}/buy-cars`,
            siteName: siteConfig.name,
        },
    };
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

interface JsonLdInput {
    cars: ListingCar[];
    total: number;
    filters: ListingFilters;
}

export function generateListingJsonLd(input: JsonLdInput): object[] {
    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Used Cars for Sale',
        numberOfItems: input.total,
        itemListElement: input.cars.map((car, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${siteConfig.url}/cars/${car.slug}`,
            item: {
                '@type': 'Car',
                name: `${car.year} ${car.brand.name} ${car.name}`,
                brand: { '@type': 'Brand', name: car.brand.name },
                modelDate: String(car.year),
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
                },
            },
        })),
    };

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
            { '@type': 'ListItem', position: 2, name: 'Buy Cars', item: `${siteConfig.url}/buy-cars` },
        ],
    };

    return [itemList, breadcrumb];
}
