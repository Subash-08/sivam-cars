'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

// Global reference to enforce "only one video plays at a time"
let currentlyPlaying: HTMLVideoElement | null = null;

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title: string;
    small?: boolean;
}

export function VideoPlayer({ src, poster, title, small = false }: VideoPlayerProps) {
    const [overlayActive, setOverlayActive] = useState(!!poster);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlayClick = () => {
        setOverlayActive(false);
    };

    // Auto-play the video when transitioning from overlay to native video
    useEffect(() => {
        if (!overlayActive && videoRef.current && poster) {
            videoRef.current.play().catch(e => console.error("Video autoplay blocked:", e));
        }
    }, [overlayActive, poster]);

    // Enforce "one video at a time" rule via native events
    useEffect(() => {
        if (!overlayActive && videoRef.current) {
            const el = videoRef.current;

            const handlePlay = () => {
                if (currentlyPlaying && currentlyPlaying !== el) {
                    currentlyPlaying.pause();
                }
                currentlyPlaying = el;
            };

            const handlePause = () => {
                if (currentlyPlaying === el) {
                    currentlyPlaying = null;
                }
            };

            el.addEventListener('play', handlePlay);
            el.addEventListener('pause', handlePause);

            return () => {
                el.removeEventListener('play', handlePlay);
                el.removeEventListener('pause', handlePause);
            };
        }
    }, [overlayActive]);

    return (
        <div className="relative w-full h-full group bg-black">
            {overlayActive && poster ? (
                <>
                    {/* Poster Image */}
                    <Image
                        src={poster}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        loading="lazy"
                    />

                    {/* Dark Overlay for contrast */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                    {/* Play Button */}
                    <button
                        onClick={handlePlayClick}
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-xl backdrop-blur-sm transition-transform hover:scale-110 hover:bg-primary ${small ? 'w-10 h-10' : 'w-16 h-16'}`}
                        aria-label={`Play ${title}`}
                    >
                        <Play className={`${small ? 'w-4 h-4 text-white ml-1' : 'w-6 h-6 ml-1 text-white'}`} fill="currentColor" />
                    </button>

                    {/* Title Overlay */}
                    {!small && (
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                            <h3 className="text-white font-medium line-clamp-1">{title}</h3>
                        </div>
                    )}
                </>
            ) : (
                <video
                    ref={videoRef}
                    src={src}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                />
            )}
        </div>
    );
}
