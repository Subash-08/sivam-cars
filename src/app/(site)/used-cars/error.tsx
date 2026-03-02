'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function BuyCarsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[BuyCarsError]', error);
    }, [error]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-7 h-7 text-destructive" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                    Something went wrong
                </h2>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    We couldn&apos;t load the car listings. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
}
