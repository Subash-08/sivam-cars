import { connectDB } from '@/lib/db';
import { Brand } from '@/models';
import { slugify } from '@/lib/utils';
import type { CreateBrandInput, UpdateBrandInput } from '@/validations/admin/brand.schema';
import { Types } from 'mongoose';

export class BrandAdminService {

    // ── List ────────────────────────────────────────────────────────────────────

    async getBrands(page = 1, limit = 20, includeDeleted = false) {
        await connectDB();

        const query = includeDeleted ? {} : { isDeleted: false };
        const skip = (page - 1) * limit;

        const [brands, total] = await Promise.all([
            Brand.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Brand.countDocuments(query),
        ]);

        return {
            brands,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
                hasNextPage: skip + limit < total,
            },
        };
    }

    // ── Create ──────────────────────────────────────────────────────────────────

    /**
     * Atomic slug uniqueness: we rely on the unique index and catch error code 11000.
     * The pre-check (findOne) is a fast optimistic path to give a nicer error message.
     * The real guarantee is the DB unique constraint — not the application check.
     */
    async createBrand(data: CreateBrandInput) {
        await connectDB();

        const slug = data.slug ?? slugify(data.name);

        try {
            const brand = await Brand.create({
                ...data,
                slug,
                isActive: true,
                isDeleted: false,
            });
            return brand.toObject();
        } catch (error: unknown) {
            // Duplicate key error (atomic — race-condition safe)
            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                (error as { code: number }).code === 11000
            ) {
                const keyPattern = (error as { keyPattern?: Record<string, unknown> }).keyPattern ?? {};
                const field = 'slug' in keyPattern ? 'slug' : 'name';
                throw new Error(`Brand with this ${field} already exists`);
            }
            console.error('[BrandAdminService.createBrand]', error);
            throw error;
        }
    }

    // ── Update ──────────────────────────────────────────────────────────────────

    async updateBrand(id: string, data: UpdateBrandInput) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid brand ID');

        const existing = await Brand.findOne({ _id: id, isDeleted: false });
        if (!existing) throw new Error('Brand not found');

        const updateData: UpdateBrandInput & { slug?: string } = { ...data };

        // Auto-update slug when name changes (unless slug was explicitly provided)
        if (data.name && data.name !== existing.name && !data.slug) {
            updateData.slug = slugify(data.name);
        }

        try {
            const brand = await Brand.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true },
            ).lean();
            return brand;
        } catch (error: unknown) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                (error as { code: number }).code === 11000
            ) {
                throw new Error('Brand with this name or slug already exists');
            }
            console.error('[BrandAdminService.updateBrand]', error);
            throw error;
        }
    }

    // ── Soft Delete ─────────────────────────────────────────────────────────────

    async softDeleteBrand(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid brand ID');

        const brand = await Brand.findOne({ _id: id, isDeleted: false });
        if (!brand) throw new Error('Brand not found');

        // Safety: block deletion if active cars reference this brand
        const { Car } = await import('@/models');
        const carCount = await Car.countDocuments({
            brand: id,
            isDeleted: false,
            isActive: true,
        });

        if (carCount > 0) {
            throw new Error(
                `Cannot delete — ${carCount} active car${carCount > 1 ? 's' : ''} use this brand`,
            );
        }

        brand.isDeleted = true;
        brand.isActive = false;
        brand.deletedAt = new Date();
        await brand.save();

        return brand.toObject();
    }
}
