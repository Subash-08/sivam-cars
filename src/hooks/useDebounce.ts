'use client';

import { useEffect, useState } from 'react';

/**
 * useDebounce — delays updating the returned value until the input
 * stops changing for `delay` milliseconds.
 *
 * Usage: const debouncedSearch = useDebounce(searchText, 400);
 */
export function useDebounce<T>(value: T, delay = 400): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
