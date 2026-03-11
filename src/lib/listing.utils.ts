import type { ListingFilters, ListingSortOption } from '@/types/listing.types';

export function parseSearchParams(
    raw: Record<string, string | string[] | undefined>,
    overrides?: Partial<ListingFilters>,
): ListingFilters {
    const toNum = (v: string | string[] | undefined): number | undefined => {
        if (!v || Array.isArray(v)) return undefined;
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
    };
    const toArr = (v: string | string[] | undefined): string | string[] | undefined => {
        if (!v) return undefined;
        return Array.isArray(v) ? v : [v];
    };

    const parsed: ListingFilters = {
        page: toNum(raw.page),
        priceMin: toNum(raw.priceMin) ?? toNum(raw.minPrice),
        priceMax: toNum(raw.priceMax) ?? toNum(raw.maxPrice),
        brand: toArr(raw.brand),
        yearMin: toNum(raw.yearMin) ?? toNum(raw.minYear),
        yearMax: toNum(raw.yearMax) ?? toNum(raw.maxYear),
        kmsMax: toNum(raw.kmsMax) ?? toNum(raw.maxKms),
        fuel: toArr(raw.fuel) ?? toArr(raw.fuelType),
        bodyType: toArr(raw.bodyType),
        transmission: toArr(raw.transmission),
        sort: (['newest', 'price_asc', 'kms_asc'].includes(raw.sort as string)
            ? raw.sort
            : 'newest') as ListingSortOption,
    };

    // Apply strict programmatic overrides
    if (overrides) {
        Object.assign(parsed, overrides);
    }

    return parsed;
}

export function countActiveFilters(raw: Record<string, string | string[] | undefined>): number {
    const filterKeys = ['priceMin', 'priceMax', 'brand', 'yearMin', 'yearMax', 'kmsMax', 'fuel', 'bodyType', 'transmission'];
    let count = 0;
    for (const key of filterKeys) {
        const val = raw[key];
        if (val) count += Array.isArray(val) ? val.length : 1;
    }
    return count;
}

export function buildSearchKey(raw: Record<string, string | string[] | undefined>): string {
    const sorted = Object.entries(raw)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${Array.isArray(v) ? [...v].sort().join(',') : v}`)
        .join('&');
    return sorted || '__default__';
}

export function parsePriceSlug(slug: string): number {
    const str = slug.toLowerCase();
    if (str.includes('lakh')) {
        const num = parseFloat(str.replace('-lakh', '').replace('lakh', ''));
        return num * 100000;
    }
    if (str.includes('k')) {
        const num = parseFloat(str.replace('k', ''));
        return num * 1000;
    }
    return parseInt(str.replace(/\D/g, ''), 10) || 1000000;
}

export function formatPriceLabel(slug: string): string {
    const str = slug.toLowerCase();
    if (str.includes('lakh')) {
        return str.replace('-lakh', ' Lakh').replace('lakh', ' Lakh');
    }
    if (str.includes('k')) {
        return str.toUpperCase();
    }
    return str;
}

// ─── Programmatic SEO Routing Helpers ──────────────────────────────────────────

export function parseFiltersFromUrl(pathname: string, searchParams: URLSearchParams): Record<string, string[]> {
    const filters: Record<string, string[]> = {};

    // Copy all SP
    searchParams.forEach((val, key) => {
        if (!filters[key]) filters[key] = [];
        filters[key].push(val);
    });

    // Reverse engineer pathname
    const path = pathname.toLowerCase();
    if (path.startsWith('/used-cars-in-')) {
        filters.city = [path.replace('/used-cars-in-', '')];
    } else if (path.startsWith('/used-cars-under-')) {
        const slug = path.replace('/used-cars-under-', '');
        const num = parsePriceSlug(slug);
        filters.priceMax = [String(num)];
    } else if (path.startsWith('/used-') && path.endsWith('-cars') && path !== '/used-cars') {
        const middle = path.replace('/used-', '').replace('-cars', '');

        const FUEL_MAP: Record<string, string> = { petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric', cng: 'CNG', lpg: 'LPG' };
        const BODY_MAP: Record<string, string> = { suv: 'SUV', sedan: 'Sedan', hatchback: 'Hatchback', muv: 'MUV', luxury: 'Luxury' };
        const TRANS_MAP: Record<string, string> = { automatic: 'Automatic', manual: 'Manual' };

        if (FUEL_MAP[middle]) {
            filters.fuel = [FUEL_MAP[middle]];
        } else if (BODY_MAP[middle]) {
            filters.bodyType = [BODY_MAP[middle]];
        } else if (TRANS_MAP[middle]) {
            filters.transmission = [TRANS_MAP[middle]];
        } else {
            filters.brand = [middle];
        }
    } else if (path.match(/^\/(\d{4})-used-cars$/)) {
        const match = path.match(/^\/(\d{4})-used-cars$/);
        if (match) {
            filters.yearMin = [match[1]];
            filters.yearMax = [match[1]];
        }
    }

    return filters;
}

export function buildListingUrl(filters: Record<string, string[]>): string {
    let basePath = '/used-cars';
    const params = new URLSearchParams();

    // Map object to URLSearchParams so we can extract easily
    Object.entries(filters).forEach(([k, vals]) => {
        vals.forEach(v => {
            if (v && v.trim() !== '') params.append(k, v);
        });
    });

    const getSingle = (key: string) => {
        const values = params.getAll(key);
        return values.length === 1 ? values[0] : null;
    };

    const city = getSingle('city');
    const brand = getSingle('brand');
    const priceMax = getSingle('priceMax');
    const bodyType = getSingle('bodyType');
    const fuel = getSingle('fuel');
    const transmission = getSingle('transmission');
    const yearMin = params.get('yearMin');
    const yearMax = params.get('yearMax');

    let priceSlug = '';
    if (priceMax && !params.get('priceMin')) {
        const num = parseInt(priceMax, 10);
        if (num === 50000) priceSlug = '50k';
        else if (num === 100000) priceSlug = '1-lakh';
        else if (num === 200000) priceSlug = '2-lakh';
        else if (num === 300000) priceSlug = '3-lakh';
        else if (num === 500000) priceSlug = '5-lakh';
        else if (num === 700000) priceSlug = '7-lakh';
        else if (num === 1000000) priceSlug = '10-lakh';
        else if (num === 1500000) priceSlug = '15-lakh';
        else if (num === 2000000) priceSlug = '20-lakh';
    }

    // Routing Priority Mode
    if (brand) {
        const brandSlug = brand.toLowerCase() === 'maruthi-suzuki' ? 'maruthi-suzuki' : brand.toLowerCase();
        basePath = `/used-${brandSlug}-cars`;
        params.delete('brand');
    } else if (city) {
        basePath = `/used-cars-in-${city.toLowerCase()}`;
        params.delete('city');
    } else if (bodyType) {
        basePath = `/used-${bodyType.toLowerCase()}-cars`;
        params.delete('bodyType');
    } else if (priceSlug) {
        basePath = `/used-cars-under-${priceSlug}`;
        params.delete('priceMax');
    } else if (fuel) {
        basePath = `/used-${fuel.toLowerCase()}-cars`;
        params.delete('fuel');
    } else if (transmission) {
        basePath = `/used-${transmission.toLowerCase()}-cars`;
        params.delete('transmission');
    } else if (yearMin && yearMin === yearMax) {
        basePath = `/${yearMin}-used-cars`;
        params.delete('yearMin');
        params.delete('yearMax');
    }

    // Remove empty 'page=1' to produce fully pristine programmatic URLs without parameters
    if (params.get('page') === '1') {
        params.delete('page');
    }

    const queryStr = params.toString();
    return queryStr ? `${basePath}?${queryStr}` : basePath;
}
