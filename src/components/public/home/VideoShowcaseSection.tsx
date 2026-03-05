import type { PublicVideoSection } from '@/services/public/videoSection.service';
import { VideoPlayer } from './VideoPlayer';

// ─── Constants ────────────────────────────────────────────────────────────────

// Uses custom thumbnail if available, otherwise undefined (native video render)
// In a Server Component, we have access to ALL env vars, preventing Vercel `NEXT_PUBLIC_` stripping issues.
const getPosterUrl = (thumbnailPublicId?: string, isReels = false) => {
    if (!thumbnailPublicId) return undefined;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    const height = isReels ? 1920 : 1080;
    const width = isReels ? 1080 : 1920;
    return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_${height},w_${width}/${thumbnailPublicId}`;
};

const getVideoSrc = (publicId: string) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}`;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoShowcaseSection({ section }: { section: PublicVideoSection }) {
    if (!section.videos || section.videos.length === 0) return null;

    const { title, subtitle, layoutType, fullWidth, marginTop, marginBottom, videos } = section;

    const marginStyle = {
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
    };

    const containerClass = fullWidth
        ? 'w-screen relative left-1/2 -translate-x-1/2 px-4 sm:px-6 lg:px-8'
        : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

    // ─── Layout Implementations ───────────────────────────────────────────────

    const renderLayout = () => {
        switch (layoutType) {
            case 'single-highlight': {
                const mainVideo = videos[0];
                const stripVideos = videos.slice(1);
                return (
                    <div className="space-y-4">
                        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-border bg-muted">
                            <VideoPlayer
                                src={getVideoSrc(mainVideo.publicId)}
                                poster={getPosterUrl(mainVideo.thumbnailPublicId, mainVideo.orientation === 'reels')}
                                title={mainVideo.title}
                            />
                        </div>
                        {stripVideos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {stripVideos.map((v) => (
                                    <div key={v.publicId} className="aspect-video rounded-xl overflow-hidden shadow border border-border bg-muted relative group">
                                        <VideoPlayer
                                            src={getVideoSrc(v.publicId)}
                                            poster={getPosterUrl(v.thumbnailPublicId, v.orientation === 'reels')}
                                            title={v.title}
                                            small
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }

            case 'grid': {
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((v) => (
                            <div key={v.publicId} className={`rounded-xl overflow-hidden shadow-md border border-border bg-muted ${v.orientation === 'reels' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                                <VideoPlayer
                                    src={getVideoSrc(v.publicId)}
                                    poster={getPosterUrl(v.thumbnailPublicId, v.orientation === 'reels')}
                                    title={v.title}
                                />
                            </div>
                        ))}
                    </div>
                );
            }

            case 'carousel': {
                return (
                    <div className="flex overflow-x-auto gap-4 pb-6 pt-2 snap-x scroll-smooth scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                        {videos.map((v) => (
                            <div key={v.publicId} className={`shrink-0 snap-center rounded-xl overflow-hidden shadow-md border border-border bg-muted ${v.orientation === 'reels' ? 'w-[280px] sm:w-[320px] aspect-[9/16]' : 'w-[300px] sm:w-[400px] lg:w-[500px] aspect-video'}`}>
                                <VideoPlayer
                                    src={getVideoSrc(v.publicId)}
                                    poster={getPosterUrl(v.thumbnailPublicId, v.orientation === 'reels')}
                                    title={v.title}
                                />
                            </div>
                        ))}
                    </div>
                );
            }

            case 'reels': {
                return (
                    <div className="flex overflow-x-auto gap-4 pb-8 pt-2 snap-x scroll-smooth scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                        {videos.map((v) => (
                            <div key={v.publicId} className="shrink-0 snap-center w-[260px] sm:w-[320px] aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden shadow-xl border border-border bg-black">
                                <VideoPlayer
                                    src={getVideoSrc(v.publicId)}
                                    poster={getPosterUrl(v.thumbnailPublicId, true)}
                                    title={v.title}
                                />
                            </div>
                        ))}
                    </div>
                );
            }

            case 'spotlight': {
                const mainVideo = videos[0];
                const sideVideos = videos.slice(1, 3); // Take up to 2 for the side column
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                        <div className="lg:col-span-2 aspect-video rounded-2xl overflow-hidden shadow-lg border border-border bg-muted">
                            <VideoPlayer
                                src={getVideoSrc(mainVideo.publicId)}
                                poster={getPosterUrl(mainVideo.thumbnailPublicId, mainVideo.orientation === 'reels')}
                                title={mainVideo.title}
                            />
                        </div>
                        {sideVideos.length > 0 && (
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                                {sideVideos.map((v) => (
                                    <div key={v.publicId} className="aspect-video rounded-2xl overflow-hidden shadow-md border border-border bg-muted">
                                        <VideoPlayer
                                            src={getVideoSrc(v.publicId)}
                                            poster={getPosterUrl(v.thumbnailPublicId, v.orientation === 'reels')}
                                            title={v.title}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }

            default:
                return null;
        }
    };

    return (
        <section style={marginStyle} className="w-full overflow-hidden">
            <div className={containerClass}>
                {/* Header Sequence */}
                <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-heading">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {renderLayout()}
            </div>
        </section>
    );
}
