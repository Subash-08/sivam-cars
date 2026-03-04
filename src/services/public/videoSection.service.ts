import { connectDB } from '@/lib/db';
import { VideoSection } from '@/models';
import type { VideoLayoutType } from '@/models';

// ─── Public video type (only fields needed for rendering) ─────────────────────

export interface PublicVideo {
    publicId: string;
    thumbnailPublicId?: string;
    title: string;
    orientation: 'landscape' | 'reels' | 'youtube';
    duration?: number;
    order: number;
}

// ─── Public video section type ────────────────────────────────────────────────

export interface PublicVideoSection {
    _id: string;
    title: string;
    subtitle?: string;
    layoutType: VideoLayoutType;
    order: number;
    fullWidth: boolean;
    marginTop: number;
    marginBottom: number;
    videos: PublicVideo[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class VideoSectionService {

    /**
     * Fetch active video sections for the public homepage.
     * Returns only isActive:true, sorted by order ASC.
     * Videos projected to minimal fields — no admin data leakage.
     */
    async getActiveVideoSections(): Promise<PublicVideoSection[]> {
        await connectDB();

        try {
            const sections = await VideoSection.find({ isActive: true })
                .populate({
                    path: 'videos.video',
                    select: 'title publicId thumbnailPublicId orientation duration', // Field projection — no admin fields
                    model: 'Video',
                })
                .sort({ order: 1 })
                .lean();

            return sections
                .map((section) => {
                    // Sort video entries and map to flat public shape
                    const sortedVideos = [...(section.videos ?? [])]
                        .sort((a, b) => (a.order as number) - (b.order as number))
                        .map((entry) => {
                            const v = entry.video as unknown as {
                                publicId: string;
                                thumbnailPublicId?: string;
                                title: string;
                                orientation: 'landscape' | 'reels' | 'youtube';
                                duration?: number;
                            };
                            return {
                                publicId: v.publicId,
                                thumbnailPublicId: v.thumbnailPublicId,
                                title: v.title,
                                orientation: v.orientation,
                                duration: v.duration,
                                order: entry.order as number,
                            };
                        })
                        .filter((v) => v.publicId); // Guard against orphaned video refs

                    return {
                        _id: String(section._id),
                        title: section.title,
                        subtitle: section.subtitle,
                        layoutType: section.layoutType,
                        order: section.order,
                        fullWidth: section.fullWidth,
                        marginTop: section.marginTop,
                        marginBottom: section.marginBottom,
                        videos: sortedVideos,
                    };
                })
                .filter((s) => s.videos.length > 0); // Skip sections with no valid videos

        } catch (error) {
            console.error('[VideoSectionService.getActiveVideoSections] Error:', error);
            return [];
        }
    }
}
