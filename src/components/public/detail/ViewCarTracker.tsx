'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface ViewCarTrackerProps {
    name: string;
    brand: string;
    price: number;
    fuel: string;
    year: number;
}

export function ViewCarTracker({
    name,
    brand,
    price,
    fuel,
    year,
}: ViewCarTrackerProps) {
    useEffect(() => {
        trackEvent('view_car', {
            car_name: name,
            brand: brand,
            price: price,
            fuel: fuel,
            year: year,
        });
    }, [name, brand, price, fuel, year]);

    return null;
}
