/**
 * src/lib/seo/vehicle-schema.ts — SEO helpers for /cars/[slug] detail page.
 *
 * Architecture: pure functions only — no DB, no HTTP.
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import type { CarDetail } from '@/services/public/car-detail.service';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export function generateDetailMetadata(car: CarDetail): Metadata {
    const title = car.metaTitle
        ? `${car.metaTitle} | ${siteConfig.name}`
        : `${car.year} ${car.brand.name} ${car.name} for Sale | ${siteConfig.name}`;

    const description = car.metaDesc
        ? car.metaDesc.slice(0, 160)
        : car.description
            ? car.description.slice(0, 160)
            : `Buy this ${car.year} ${car.brand.name} ${car.name} — ${car.fuelType}, ${car.transmission}, ${car.kmsDriven.toLocaleString('en-IN')} km driven. Verified by ${siteConfig.name}.`;

    const canonical = `/cars/${car.slug}`;

    const primaryImage = car.images.find((i) => i.isPrimary) ?? car.images[0];

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `${siteConfig.url}${canonical}`,
            siteName: siteConfig.name,
            ...(primaryImage && {
                images: [{ url: primaryImage.url, alt: primaryImage.alt ?? car.name }],
            }),
        },
    };
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

export function generateVehicleJsonLd(car: CarDetail): object[] {
    const primaryImage = car.images.find((i) => i.isPrimary) ?? car.images[0];
    const carUrl = `${siteConfig.url}/cars/${car.slug}`;

    // Vehicle + Offer schema
    const vehicle = {
        '@context': 'https://schema.org',
        '@type': 'Car',
        name: `${car.year} ${car.brand.name} ${car.name}`,
        brand: { '@type': 'Brand', name: car.brand.name },
        modelDate: String(car.year),
        vehicleModelDate: String(car.year),
        mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: car.kmsDriven,
            unitCode: 'KMT',
        },
        fuelType: car.fuelType,
        vehicleTransmission: car.transmission,
        bodyType: car.bodyType,
        color: car.color,
        vehicleInteriorColor: undefined,
        numberOfForwardGears: undefined,
        description: car.description,
        image: primaryImage?.url,
        url: carUrl,
        offers: {
            '@type': 'Offer',
            price: car.price,
            priceCurrency: 'INR',
            availability: car.isSold
                ? 'https://schema.org/SoldOut'
                : 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: siteConfig.name,
                url: siteConfig.url,
            },
        },
    };

    // Breadcrumb schema
    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
            { '@type': 'ListItem', position: 2, name: 'Buy Cars', item: `${siteConfig.url}/buy-cars` },
            { '@type': 'ListItem', position: 3, name: `${car.brand.name}`, item: `${siteConfig.url}/buy-cars?brand=${car.brand.slug}` },
            { '@type': 'ListItem', position: 4, name: `${car.year} ${car.brand.name} ${car.name}`, item: carUrl },
        ],
    };

    // Organization reference
    const organization = {
        '@context': 'https://schema.org',
        '@type': 'AutoDealer',
        name: siteConfig.name,
        url: siteConfig.url,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: siteConfig.address,
        },
    };

    return [vehicle, breadcrumb, organization];
}
