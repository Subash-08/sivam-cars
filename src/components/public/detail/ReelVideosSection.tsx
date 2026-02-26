'use client';

interface ReelVideo {
    url: string;
    publicId: string;
    order: number;
}

interface ReelVideosSectionProps {
    videos: ReelVideo[];
}

export function ReelVideosSection({ videos }: ReelVideosSectionProps) {
    if (videos.length === 0) return null;

    return (
        <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Reels & Walkaround</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                {videos.map((video, i) => (
                    <div
                        key={video.publicId}
                        className="relative rounded-xl overflow-hidden bg-muted border border-border group flex-shrink-0 w-48 sm:w-64 snap-start"
                    >
                        <video
                            src={video.url}
                            className="w-full aspect-[9/16] object-cover"
                            controls
                            playsInline
                            preload="metadata"
                            muted
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary text-primary-foreground">
                            Reel {i + 1}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
