import { connectDB } from '@/lib/db';
import { CustomerStory } from '@/models';
import type { CreateCustomerStoryInput, UpdateCustomerStoryInput } from '@/validations/admin/customerStory.schema';
import { Types } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// ─── Service ──────────────────────────────────────────────────────────────────

export class CustomerStoryAdminService {

    // ── List all stories (admin) ─────────────────────────────────────────────────

    async getAll() {
        await connectDB();

        const stories = await CustomerStory.find()
            .sort({ order: 1, createdAt: -1 })
            .lean();

        return stories;
    }

    // ── Get single story ─────────────────────────────────────────────────────────

    async getById(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid story ID');

        const story = await CustomerStory.findById(id).lean();
        if (!story) throw new Error('Story not found');
        return story;
    }

    // ── Create ───────────────────────────────────────────────────────────────────

    async create(data: CreateCustomerStoryInput) {
        await connectDB();

        const story = await CustomerStory.create(data);
        return CustomerStory.findById(story._id).lean();
    }

    // ── Update ───────────────────────────────────────────────────────────────────

    async update(id: string, data: UpdateCustomerStoryInput) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid story ID');

        const existing = await CustomerStory.findById(id);
        if (!existing) throw new Error('Story not found');

        // If image changed, delete old from Cloudinary
        if (data.imagePublicId && data.imagePublicId !== existing.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(existing.imagePublicId);
            } catch (err) {
                console.error('[CustomerStoryAdmin] Failed to delete old image:', err);
            }
        }

        const story = await CustomerStory.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true },
        ).lean();

        return story;
    }

    // ── Delete (hard delete) ─────────────────────────────────────────────────────

    async delete(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid story ID');

        const story = await CustomerStory.findById(id);
        if (!story) throw new Error('Story not found');

        // Delete image from Cloudinary
        if (story.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(story.imagePublicId);
            } catch (err) {
                console.error('[CustomerStoryAdmin] Failed to delete image:', err);
            }
        }

        await CustomerStory.findByIdAndDelete(id);
        return { deleted: true };
    }

    // ── Reorder ──────────────────────────────────────────────────────────────────

    async reorder(orderedIds: string[]) {
        await connectDB();

        for (const id of orderedIds) {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid story ID: ${id}`);
            }
        }

        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { order: index } },
            },
        }));

        await CustomerStory.bulkWrite(bulkOps);
        return this.getAll();
    }
}
