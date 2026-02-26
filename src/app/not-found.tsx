import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Not Found | SivamCars',
};

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl font-bold text-brand-600/40 mb-2 select-none">
                    404
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
                <p className="text-slate-400 mb-10 leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Browse our full car inventory or contact us for assistance.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        href="/cars"
                        className="inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Browse Cars
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center border border-surface-border hover:border-brand-600 text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
