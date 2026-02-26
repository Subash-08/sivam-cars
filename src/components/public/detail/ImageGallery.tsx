'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface GalleryImage {
    url: string;
    publicId: string;
    alt?: string;
    isPrimary?: boolean;
    order?: number;
}

interface GalleryVideo {
    url: string;
    publicId: string;
    order: number;
}

type MediaItem =
    | { type: 'image'; data: GalleryImage; index: number }
    | { type: 'video'; data: GalleryVideo; index: number };

interface ImageGalleryProps {
    images: GalleryImage[];
    videos: GalleryVideo[];
    carName: string;
}

export function ImageGallery({ images, videos, carName }: ImageGalleryProps) {
    // Sort images: primary first, then by order
    const sortedImages = [...images].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return (a.order ?? 0) - (b.order ?? 0);
    });

    // Interleave: all images first, then gallery videos
    const media: MediaItem[] = [
        ...sortedImages.map((img, i) => ({ type: 'image' as const, data: img, index: i })),
        ...videos.map((vid, i) => ({ type: 'video' as const, data: vid, index: i })),
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    const goNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % media.length);
    }, [media.length]);

    const goPrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + media.length) % media.length);
    }, [media.length]);

    if (media.length === 0) {
        return (
            <div className="w-full aspect-[16/10] bg-muted rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No images available</p>
            </div>
        );
    }

    const activeItem = media[activeIndex];

    return (
        <div className="space-y-3">
            {/* ── Main Viewer ──────────────────────────────────────────── */}
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-muted group">
                {activeItem.type === 'video' ? (
                    <video
                        key={(activeItem.data as GalleryVideo).url}
                        src={(activeItem.data as GalleryVideo).url}
                        className="w-full h-full object-contain bg-black"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        preload="metadata"
                    />
                ) : (
                    <Image
                        src={(activeItem.data as GalleryImage).url}
                        alt={(activeItem.data as GalleryImage).alt ?? `${carName} - Image ${activeIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 60vw"
                        priority={activeIndex === 0}
                    />
                )}

                {/* Navigation Arrows */}
                {media.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground/50 text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/70 backdrop-blur-sm"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground/50 text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/70 backdrop-blur-sm"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Counter badge */}
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-foreground/60 text-primary-foreground text-xs font-medium backdrop-blur-sm">
                    {activeIndex + 1} / {media.length}
                </span>

                {/* Video indicator */}
                {activeItem.type === 'video' && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider">
                        Video
                    </span>
                )}
            </div>

            {/* ── Thumbnails ───────────────────────────────────────────── */}
            {media.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {media.map((item, i) => (
                        <button
                            key={`${item.type}-${item.index}`}
                            type="button"
                            onClick={() => setActiveIndex(i)}
                            className={`
                                relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all
                                ${activeIndex === i
                                    ? 'border-primary ring-1 ring-primary/30'
                                    : 'border-transparent hover:border-border-strong opacity-70 hover:opacity-100'}
                            `}
                        >
                            {item.type === 'image' ? (
                                <Image
                                    src={(item.data as GalleryImage).url}
                                    alt={(item.data as GalleryImage).alt ?? `Thumbnail ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                            ) : (
                                <>
                                    <video
                                        src={(item.data as GalleryVideo).url}
                                        className="w-full h-full object-cover"
                                        muted
                                        preload="metadata"
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center bg-foreground/40">
                                        <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                                    </span>
                                </>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
