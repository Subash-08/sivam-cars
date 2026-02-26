'use client';

import Button from '@/components/ui/Button';

export default function CarDetailError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <span className="text-4xl mb-4">😕</span>
            <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
                We couldn&apos;t load this car&apos;s details. This might be a temporary issue.
            </p>
            <Button onClick={reset} variant="primary">
                Try Again
            </Button>
        </div>
    );
}
