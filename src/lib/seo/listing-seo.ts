/**
 * src/lib/seo/listing-seo.ts — SEO helpers for /used-cars page.
 *
 * Architecture: pure functions only — no DB, no HTTP.
 * Uses siteConfig for canonical URLs.
 */

import type { Metadata } from 'next';
import type { ListingCar, ListingFilters } from '@/types/listing.types';
import { siteConfig } from '@/config/site';

// ─── Metadata ─────────────────────────────────────────────────────────────────

interface MetadataInput {
    total: number;
    // Context indicators
    brands?: string[];
    priceMin?: number;
    priceMax?: number;
    city?: string;
    bodyType?: string;
    fuel?: string;
    transmission?: string;
    yearMin?: number;
    yearMax?: number;

    // Explicit overrides for programmatic pages:
    title?: string;
    description?: string;
    canonicalPath?: string;
    page?: number;
}

export function generateListingMetadata(input: MetadataInput, hasComplexFilters: boolean = false): Metadata {
    let title = input.title;
    let description = input.description;

    // Automatically generate strong programmatic SEO Titles & Descriptions if none provided
    if (!title) {
        if (input.city) {
            const cityName = input.city.charAt(0).toUpperCase() + input.city.slice(1);
            title = `Used Cars in ${cityName} | Second Hand Cars for Sale | ${siteConfig.name}`;
            description = `Browse verified used cars available for buyers in ${cityName} at ${siteConfig.name}. Explore SUVs, sedans, and hatchbacks with transparent pricing and easy EMI options.`;
        } else if (input.brands && input.brands.length === 1) {
            const b = input.brands[0];
            const brandName = b.toLowerCase() === 'maruti-suzuki' ? 'Maruti Suzuki' : b.charAt(0).toUpperCase() + b.slice(1);
            title = `Used ${brandName} Cars for Sale | Verified Pre-Owned ${brandName} Cars | ${siteConfig.name}`;
            description = `Explore high-quality, pre-owned ${brandName} cars at ${siteConfig.name}. Fully inspected, certified used ${brandName} vehicles with best-in-class pricing and warranty.`;
        } else if (input.bodyType) {
            const bType = input.bodyType.toUpperCase() === 'SUV' || input.bodyType.toUpperCase() === 'MUV'
                ? input.bodyType.toUpperCase()
                : input.bodyType.charAt(0).toUpperCase() + input.bodyType.slice(1);
            title = `Used ${bType} Cars | Best Second Hand ${bType}s for Sale | ${siteConfig.name}`;
            description = `Looking for a reliable used ${bType}? Browse top-rated pre-owned ${bType}s at ${siteConfig.name}. Compare prices, features, and find your perfect family car today.`;
        } else if (input.fuel) {
            const fType = input.fuel.toUpperCase() === 'CNG' || input.fuel.toUpperCase() === 'LPG'
                ? input.fuel.toUpperCase()
                : input.fuel.charAt(0).toUpperCase() + input.fuel.slice(1);
            title = `Used ${fType} Cars | Fuel Efficient Pre-Owned ${fType} Cars | ${siteConfig.name}`;
            description = `Save on running costs with our premium collection of used ${fType} cars. Explore certified, highly efficient second hand ${fType} vehicles available at ${siteConfig.name}.`;
        } else if (input.transmission) {
            const tType = input.transmission.charAt(0).toUpperCase() + input.transmission.slice(1);
            title = `Used ${tType} Cars | Best Pre-Owned ${tType} Vehicles | ${siteConfig.name}`;
            description = `Enjoy effortless driving with our huge range of used ${tType} cars. Browse inspected and certified ${tType} second-hand vehicles with flexible loan options.`;
        } else if (input.priceMax) {
            const lak = (input.priceMax / 100000).toFixed(0);
            title = `Best Used Cars Under ${lak} Lakh | Affordable Second Hand Cars | ${siteConfig.name}`;
            description = `Find the best used cars under ${lak} Lakh at ${siteConfig.name}. Reliable, certified pre-owned vehicles perfect for budget buyers looking for maximum value.`;
        } else {
            // Fallback Generic
            title = `Buy Verified Used Cars | Second Hand Cars for Sale | ${siteConfig.name}`;
            description = `Browse ${input.total} quality pre-owned cars at ${siteConfig.name}. Verified, inspected, and ready to drive with transparent pricing and easy financing.`;
        }
    }

    // Enforce 60-char limit for display if generated manually, but our SEO templates above are strictly tuned
    if (title.length > 70) title = title.slice(0, 67) + '...';

    const finalDescription = description
        ?? `Browse ${input.total} quality pre-owned cars at ${siteConfig.name}. Verified, inspected, and ready to drive.`;

    // Drop secondary filters from canonical, but keep page if > 1
    let canonical = input.canonicalPath || '/used-cars';
    if (input.page && input.page > 1) {
        canonical += `?page=${input.page}`;
    }

    return {
        title,
        description: finalDescription.slice(0, 160),
        keywords: [
            "used cars kallakurichi",
            "second hand cars kallakurichi",
            "used cars attur",
            "used cars salem",
            "used suv cars",
            "used cars under 5 lakh",
            "used hyundai cars",
            "used kia cars",
            "best used cars under 5 lakh",
            "used suv cars in tamil nadu",
            "second hand cars in attur"
        ],
        alternates: {
            canonical,
            languages: {
                'en-IN': `${siteConfig.url}${canonical}`,
            },
        },
        robots: hasComplexFilters ? { index: false, follow: true } : { index: true, follow: true },
        openGraph: {
            title,
            description: finalDescription.slice(0, 160),
            type: 'website',
            url: `${siteConfig.url}${canonical}`,
            siteName: siteConfig.name,
            images: siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: finalDescription.slice(0, 160),
            images: siteConfig.ogImage ? [siteConfig.ogImage] : [],
        },
    };
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

interface JsonLdInput {
    cars: ListingCar[];
    total: number;
    filters: ListingFilters;
    breadcrumbContext?: {
        name: string;
        path: string;
        type?: string;
    };
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

    const breadcrumbElements = [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: 'Used Cars', item: `${siteConfig.url}/used-cars` },
    ];

    if (input.breadcrumbContext) {
        if (input.breadcrumbContext.type) {
            breadcrumbElements.push({
                '@type': 'ListItem',
                position: 3,
                name: input.breadcrumbContext.type,
                item: `${siteConfig.url}/used-cars`
            });
            breadcrumbElements.push({
                '@type': 'ListItem',
                position: 4,
                name: input.breadcrumbContext.name,
                item: `${siteConfig.url}${input.breadcrumbContext.path}`
            });
        } else {
            breadcrumbElements.push({
                '@type': 'ListItem',
                position: 3,
                name: input.breadcrumbContext.name,
                item: `${siteConfig.url}${input.breadcrumbContext.path}`
            });
        }
    }

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbElements,
    };

    return [itemList, breadcrumb];
}

export function generateLocalBusinessJsonLd(city: string): object {
    return {
        '@context': 'https://schema.org',
        '@type': ['AutoDealer', 'LocalBusiness', 'Organization'],
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        telephone: '09715015015',
        priceRange: '₹₹₹',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'MAIN ROAD, near BHARATHI WOMAN S COLLAGE',
            addressLocality: 'Kallakurichi',
            addressRegion: 'Tamil Nadu',
            postalCode: '606213',
            addressCountry: 'IN'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 11.7383,
            longitude: 78.9639
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '08:00',
                closes: '22:00'
            }
        ],
        areaServed: {
            '@type': 'City',
            name: city
        }
    };
}

export function generateFaqJsonLd(faqs: Array<{ question: string; answer: string }>): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
}

// ─── Dynamic Content Generation (For Footer Blocks) ─────────────────────────

export function generateProgrammaticContent(input: MetadataInput): { title: string; text: string } | null {
    if (input.city) {
        const c = input.city.charAt(0).toUpperCase() + input.city.slice(1);
        return {
            title: `Why Buy Used Cars in ${c}?`,
            text: `${siteConfig.name} serves customers in ${c} and nearby areas with fully inspected, high-quality pre-owned cars. Browse our verified vehicles with transparent pricing, zero hidden fees, and easy EMI financing options tailored for buyers in ${c}.`
        };
    }
    if (input.bodyType) {
        const b = input.bodyType.toUpperCase() === 'SUV' || input.bodyType.toUpperCase() === 'MUV'
            ? input.bodyType.toUpperCase()
            : input.bodyType.charAt(0).toUpperCase() + input.bodyType.slice(1);
        return {
            title: `Why Buy a Used ${b}?`,
            text: `Used ${b}s offer the perfect blend of space, comfort, and unmatched road presence. Whether for city commutes or weekend family trips, a well-maintained second-hand ${b} from ${siteConfig.name} guarantees reliability and incredible value for money.`
        };
    }
    if (input.priceMax) {
        const lak = (input.priceMax / 100000).toFixed(0);
        return {
            title: `Best Used Cars Under ${lak} Lakh`,
            text: `Looking for top-tier vehicles within a strict budget? Explore our curated inventory of the best used cars under ${lak} Lakh. Every car is thoroughly checked for quality & performance so you can drive home with peace of mind without breaking the bank.`
        };
    }
    if (input.brands && input.brands.length === 1) {
        const b = input.brands[0];
        const brandName = b.toLowerCase() === 'maruti-suzuki' ? 'Maruti Suzuki' : b.charAt(0).toUpperCase() + b.slice(1);
        return {
            title: `Why Choose Pre-Owned ${brandName} Cars?`,
            text: `${brandName} is renowned for its durability, low maintenance costs, and exceptional resale value. At ${siteConfig.name}, we offer a wide range of verified used ${brandName} vehicles equipped with robust warranties and hassle-free paperwork.`
        };
    }
    return null;
}

export function generateProgrammaticFaqs(input: MetadataInput): Array<{ question: string; answer: string }> {
    const faqs: Array<{ question: string; answer: string }> = [];

    if (input.city) {
        const c = input.city.charAt(0).toUpperCase() + input.city.slice(1);
        faqs.push(
            { question: `Can I buy used cars in ${c} from ${siteConfig.name}?`, answer: `Yes! ${siteConfig.name} actively serves customers looking for verified pre-owned vehicles in ${c} and surrounding areas.` },
            { question: `Does ${siteConfig.name} offer car loans in ${c}?`, answer: `Absolutely. We provide flexible and fast EMI financing options with partnered banks for all customers buying a car in ${c}.` },
            { question: `Can I schedule a test drive in ${c}?`, answer: `Yes, you can easily contact us to book a test drive for any of the cars available in our ${c} inventory.` }
        );
    } else if (input.bodyType) {
        const b = input.bodyType.toUpperCase() === 'SUV' || input.bodyType.toUpperCase() === 'MUV' ? input.bodyType.toUpperCase() : input.bodyType.charAt(0).toUpperCase() + input.bodyType.slice(1);
        faqs.push(
            { question: `Are second hand ${b}s reliable?`, answer: `Yes, all our used ${b}s undergo a rigorous multi-point inspection to ensure they are mechanically sound and highly reliable for long-term use.` },
            { question: `What are the benefits of buying a used ${b}?`, answer: `Buying a used ${b} saves you from steep initial depreciation while still providing you with premium features, massive cabin space, and robust safety.` }
        );
    } else if (input.priceMax) {
        const lak = (input.priceMax / 100000).toFixed(0);
        faqs.push(
            { question: `Are cars under ${lak} Lakh in good condition?`, answer: `Yes, every car under ${lak} Lakh at ${siteConfig.name} is fully verified. We never compromise on quality, regardless of the price bracket.` },
            { question: `Can I get a loan for a used car under ${lak} Lakh?`, answer: `Yes! We provide competitive car loan options even for our budget-friendly vehicles under ${lak} Lakh.` }
        );
    } else {
        faqs.push(
            { question: `Why should I buy a used car from ${siteConfig.name}?`, answer: `We offer transparent pricing, verified vehicle histories, easy financing, and a hassle-free paper transfer process.` },
            { question: `Do you offer warranties on pre-owned cars?`, answer: `Yes, we offer comprehensive warranty packages on selected certified pre-owned cars for your peace of mind.` }
        );
    }

    return faqs;
}
