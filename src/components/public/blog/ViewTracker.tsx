/**
 * src/components/public/blog/ViewTracker.tsx
 *
 * Client component to fire view increment silently without busting ISR cache.
 */
'use client';

import { useEffect } from 'react';

export default function ViewTracker({ slug }: { slug: string }) {
    useEffect(() => {
        // Fire and forget
        fetch(`/api/blog/view?slug=${slug}`, { method: 'POST' }).catch(() => { });
    }, [slug]);

    return null; // Silent render
}
