import { connectDB } from '@/lib/db';
import { Video } from '@/models';
import type { CreateVideoInput, UpdateVideoInput } from '@/validations/admin/video.schema';
import { Types } from 'mongoose';

// ─── Service ──────────────────────────────────────────────────────────────────

export class VideoAdminService {

    // ── List all videos (admin) — paginated, optional text search ────────────────

    async getAll(page = 1, limit = 12, search = ''): Promise<{
        videos: Record<string, unknown>[];
        pagination: { total: number; page: number; totalPages: number; hasNextPage: boolean };
    }> {
        await connectDB();

        const skip = (page - 1) * limit;

        // Build query — use text index when search is provided
        const query = search
            ? { $text: { $search: search } }
            : {};

        const [videos, total] = await Promise.all([
            Video.find(query)
                .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Video.countDocuments(query),
        ]);

        return {
            videos: videos as unknown as Record<string, unknown>[],
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
            },
        };
    }

    // ── Get single video ─────────────────────────────────────────────────────────

    async getById(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid video ID');

        const video = await Video.findById(id).lean();
        if (!video) throw new Error('Video not found');
        return video;
    }

    // ── Create ───────────────────────────────────────────────────────────────────

    async create(data: CreateVideoInput) {
        await connectDB();
        const video = await Video.create(data);
        return Video.findById(video._id).lean();
    }

    // ── Update ───────────────────────────────────────────────────────────────────

    async update(id: string, data: UpdateVideoInput) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid video ID');

        const video = await Video.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true },
        ).lean();

        if (!video) throw new Error('Video not found');
        return video;
    }

    // ── Delete ───────────────────────────────────────────────────────────────────

    async delete(id: string): Promise<{ deleted: true; publicId: string }> {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid video ID');

        const video = await Video.findById(id).lean();
        if (!video) throw new Error('Video not found');

        await Video.findByIdAndDelete(id);

        // Return publicId so caller can delete from Cloudinary if needed
        return { deleted: true, publicId: video.publicId };
    }
}
