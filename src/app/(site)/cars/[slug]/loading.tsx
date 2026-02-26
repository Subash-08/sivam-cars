export default function CarDetailLoading() {
    return (
        <div className="bg-background min-h-screen">
            {/* Breadcrumb skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-3 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-3 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {/* Gallery skeleton */}
                        <div className="w-full aspect-[16/10] bg-muted rounded-xl animate-pulse" />
                        <div className="flex gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-24 h-16 bg-muted rounded-lg animate-pulse flex-shrink-0" />
                            ))}
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <div className="h-7 w-3/4 bg-muted rounded animate-pulse" />
                            <div className="flex gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-7 w-20 bg-muted rounded-full animate-pulse" />
                                ))}
                            </div>
                        </div>

                        {/* Overview grid */}
                        <div className="grid grid-cols-3 gap-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                            ))}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="hidden lg:block w-[380px] flex-shrink-0 space-y-5">
                        <div className="h-40 bg-muted rounded-xl animate-pulse" />
                        <div className="h-12 bg-muted rounded-lg animate-pulse" />
                        <div className="h-12 bg-muted rounded-lg animate-pulse" />
                        <div className="h-52 bg-muted rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
