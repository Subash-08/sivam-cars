import { connectDB } from '@/lib/db';
import { HomeSection, Car } from '@/models';
import type { CreateHomeSectionInput, UpdateHomeSectionInput } from '@/validations/admin/homeSection.schema';
import { Types } from 'mongoose';

// ─── Service ──────────────────────────────────────────────────────────────────

export class HomeSectionAdminService {

    // ── List all sections (admin) ────────────────────────────────────────────────

    async getAll(): Promise<ReturnType<typeof HomeSection.find>> {
        await connectDB();

        const sections = await HomeSection.find()
            .populate({
                path: 'cars',
                select: 'name slug price year images brand isActive isDeleted',
                populate: { path: 'brand', select: 'name slug logo' },
            })
            .sort({ order: 1, createdAt: -1 })
            .lean();

        return sections;
    }

    // ── Get single section ───────────────────────────────────────────────────────

    async getById(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid section ID');

        const section = await HomeSection.findById(id)
            .populate({
                path: 'cars',
                select: 'name slug price year images brand isActive isDeleted',
                populate: { path: 'brand', select: 'name slug logo' },
            })
            .lean();

        if (!section) throw new Error('Section not found');
        return section;
    }

    // ── Create ───────────────────────────────────────────────────────────────────

    async create(data: CreateHomeSectionInput) {
        await connectDB();

        // Validate car IDs exist
        if (data.cars && data.cars.length > 0) {
            const validCars = await Car.countDocuments({
                _id: { $in: data.cars },
                isDeleted: false,
            });
            if (validCars !== data.cars.length) {
                throw new Error('One or more car IDs are invalid');
            }
        }

        const section = await HomeSection.create(data);

        // Return populated version
        return HomeSection.findById(section._id)
            .populate({
                path: 'cars',
                select: 'name slug price year images brand isActive isDeleted',
                populate: { path: 'brand', select: 'name slug logo' },
            })
            .lean();
    }

    // ── Update ───────────────────────────────────────────────────────────────────

    async update(id: string, data: UpdateHomeSectionInput) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid section ID');

        const existing = await HomeSection.findById(id);
        if (!existing) throw new Error('Section not found');

        // Validate car IDs if being updated
        if (data.cars && data.cars.length > 0) {
            const validCars = await Car.countDocuments({
                _id: { $in: data.cars },
                isDeleted: false,
            });
            if (validCars !== data.cars.length) {
                throw new Error('One or more car IDs are invalid');
            }
        }

        const section = await HomeSection.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true },
        )
            .populate({
                path: 'cars',
                select: 'name slug price year images brand isActive isDeleted',
                populate: { path: 'brand', select: 'name slug logo' },
            })
            .lean();

        return section;
    }

    // ── Delete (hard delete — config data, not content) ──────────────────────────

    async delete(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid section ID');

        const section = await HomeSection.findById(id);
        if (!section) throw new Error('Section not found');

        await HomeSection.findByIdAndDelete(id);
        return { deleted: true };
    }

    // ── Reorder ──────────────────────────────────────────────────────────────────

    async reorder(orderedIds: string[]) {
        await connectDB();

        // Validate all IDs
        for (const id of orderedIds) {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid section ID: ${id}`);
            }
        }

        // Bulk update order field
        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { order: index } },
            },
        }));

        await HomeSection.bulkWrite(bulkOps);

        // Return updated list
        return this.getAll();
    }
}
