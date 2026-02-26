/**
 * /buy-cars loading skeleton — matches the grid layout structure.
 * Uses theme tokens only.
 */

export default function BuyCarsLoading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <div className="h-7 w-48 bg-muted rounded-lg" />
                    <div className="h-4 w-28 bg-muted rounded mt-2" />
                </div>
                <div className="h-9 w-36 bg-muted rounded-lg" />
            </div>

            <div className="flex gap-8">
                {/* Sidebar skeleton (desktop) */}
                <aside className="hidden lg:block w-[280px] flex-shrink-0 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-20 bg-muted rounded" />
                                <div className="h-9 w-full bg-muted rounded-lg" />
                                {i === 2 && (
                                    <div className="space-y-1.5">
                                        {[1, 2, 3, 4].map((j) => (
                                            <div key={j} className="flex justify-between">
                                                <div className="h-3.5 w-20 bg-muted rounded" />
                                                <div className="h-3.5 w-6 bg-muted rounded" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Grid skeleton */}
                <main className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="aspect-[4/3] bg-muted" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 w-3/4 bg-muted rounded" />
                                    <div className="flex gap-2">
                                        <div className="h-3 w-16 bg-muted rounded" />
                                        <div className="h-3 w-12 bg-muted rounded" />
                                        <div className="h-3 w-14 bg-muted rounded" />
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <div className="h-5 w-24 bg-muted rounded" />
                                        <div className="h-8 w-24 bg-muted rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
