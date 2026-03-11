import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'cng', 'lpg'];
const BODY_TYPES = ['suv', 'sedan', 'hatchback', 'muv', 'luxury'];
const TRANSMISSIONS = ['automatic', 'manual'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // We only process rewrite logic for paths that look like our programmatic SEO ones
    if (pathname.startsWith('/used-cars-in-')) {
        const city = pathname.replace('/used-cars-in-', '');
        return NextResponse.rewrite(new URL(`/location/${city}`, request.url));
    }

    if (pathname.startsWith('/used-cars-under-')) {
        const price = pathname.replace('/used-cars-under-', '');
        return NextResponse.rewrite(new URL(`/budget/${price}`, request.url));
    }

    const yearMatch = pathname.match(/^\/(\d{4})-used-cars$/);
    if (yearMatch) {
        return NextResponse.rewrite(new URL(`/year/${yearMatch[1]}`, request.url));
    }

    if (pathname.startsWith('/used-') && pathname.endsWith('-cars') && pathname !== '/used-cars') {
        const slug = pathname.replace('/used-', '').replace('-cars', '');

        if (FUEL_TYPES.includes(slug)) {
            return NextResponse.rewrite(new URL(`/fuel/${slug}`, request.url));
        }
        if (BODY_TYPES.includes(slug)) {
            return NextResponse.rewrite(new URL(`/body/${slug}`, request.url));
        }
        if (TRANSMISSIONS.includes(slug)) {
            return NextResponse.rewrite(new URL(`/transmission/${slug}`, request.url));
        }

        // If it doesn't match above, it defaults to brand
        return NextResponse.rewrite(new URL(`/brand/${slug}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Only run middleware on non-API, non-static, non-image requests
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|images).*)',
    ],
};
