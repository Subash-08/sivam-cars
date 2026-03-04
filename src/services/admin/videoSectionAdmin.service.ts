import { connectDB } from '@/lib/db';
import { Video, VideoSection } from '@/models';
import type {
    CreateVideoSectionInput,
    UpdateVideoSectionInput,
    VideoEntryInput,
} from '@/validations/admin/videoSection.schema';
import { Types } from 'mongoose';

// ─── Projection for populated video documents ──────────────────────────────────
// Only expose fields needed by the admin UI — no leaked internal fields

const VIDEO_SELECT = 'title publicId thumbnailPublicId orientation duration';

// ─── Service ──────────────────────────────────────────────────────────────────

export class VideoSectionAdminService {

    // ── List all sections (admin) ────────────────────────────────────────────────

    async getAll() {
        await connectDB();

        const sections = await VideoSection.find()
            .populate({
                path: 'videos.video',
                select: VIDEO_SELECT,
                model: 'Video',
            })
            .sort({ order: 1, createdAt: -1 })
            .lean();

        return sections.map(this.normalise);
    }

    // ── Get single section ───────────────────────────────────────────────────────

    async getById(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid section ID');

        const section = await VideoSection.findById(id)
            .populate({
                path: 'videos.video',
                select: VIDEO_SELECT,
                model: 'Video',
            })
            .lean();

        if (!section) throw new Error('Section not found');
        return this.normalise(section);
    }

    // ── Create ───────────────────────────────────────────────────────────────────

    async create(data: CreateVideoSectionInput) {
        await connectDB();

        const videos = await this.buildVideoEntries(data.videos);

        const section = await VideoSection.create({ ...data, videos });

        return VideoSection.findById(section._id)
            .populate({ path: 'videos.video', select: VIDEO_SELECT, model: 'Video' })
            .lean()
            .then((s) => this.normalise(s!));
    }

    // ── Update ───────────────────────────────────────────────────────────────────

    async update(id: string, data: UpdateVideoSectionInput) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid section ID');

        const existing = await VideoSection.findById(id);
        if (!existing) throw new Error('Section not found');

        const payload: Record<string, unknown> = { ...data };
        if (data.videos !== undefined) {
            payload.videos = await this.buildVideoEntries(data.videos);
        }

        const section = await VideoSection.findByIdAndUpdate(
            id,
            payload,
            { new: true, runValidators: true },
        )
            .populate({ path: 'videos.video', select: VIDEO_SELECT, model: 'Video' })
            .lean();

        return this.normalise(section);
    }

    // ── Delete ───────────────────────────────────────────────────────────────────

    async delete(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid section ID');

        const section = await VideoSection.findById(id);
        if (!section) throw new Error('Section not found');

        await VideoSection.findByIdAndDelete(id);
        return { deleted: true };
    }

    // ── Reorder ──────────────────────────────────────────────────────────────────

    async reorder(orderedIds: string[]) {
        await connectDB();

        for (const id of orderedIds) {
            if (!Types.ObjectId.isValid(id)) throw new Error(`Invalid section ID: ${id}`);
        }

        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { order: index } },
            },
        }));

        await VideoSection.bulkWrite(bulkOps);
        return this.getAll();
    }

    // ─── Private helpers ─────────────────────────────────────────────────────────

    /**
     * Validate that all referenced Video IDs exist and build DB-ready subdocument array.
     */
    private async buildVideoEntries(
        entries: VideoEntryInput[] | undefined,
    ): Promise<Array<{ video: Types.ObjectId; order: number }>> {
        if (!entries || entries.length === 0) return [];

        const ids = entries.map((e) => e.videoId);
        const validCount = await Video.countDocuments({ _id: { $in: ids } });
        if (validCount !== ids.length) {
            throw new Error('One or more video IDs are invalid');
        }

        return entries.map((e) => ({
            video: new Types.ObjectId(e.videoId),
            order: e.order,
        })) as unknown as Array<{ video: Types.ObjectId; order: number }>;
    }

    /**
     * Sort each section's videos by their stored order field before returning.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private normalise(section: any) {
        if (!section) return section;
        if (Array.isArray(section.videos)) {
            section.videos = [...section.videos].sort(
                (a: { order: number }, b: { order: number }) => a.order - b.order,
            );
        }
        return section;
    }
}
