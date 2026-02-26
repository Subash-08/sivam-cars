'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        console.error('[Global Error]', error);
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-screen bg-surface flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="text-7xl font-bold text-brand-600 mb-4">500</div>
                    <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        An unexpected error occurred. Our team has been notified. Please try again.
                    </p>
                    {error.digest && (
                        <p className="text-slate-600 text-xs mb-6 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                    <div className="flex justify-center gap-3">
                        <Button onClick={reset} variant="primary">
                            Try Again
                        </Button>
                        <Button
                            onClick={() => (window.location.href = '/')}
                            variant="secondary"
                        >
                            Go Home
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    );
}
