'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

function GoogleAnalyticsEvents() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
            let url = pathname;
            if (searchParams && searchParams.toString()) {
                url = `${url}?${searchParams.toString()}`;
            }
            trackPageView(url);
        }
    }, [pathname, searchParams]);

    return null;
}

export function GoogleAnalyticsTracker() {
    return (
        <Suspense fallback={null}>
            <GoogleAnalyticsEvents />
        </Suspense>
    );
}
