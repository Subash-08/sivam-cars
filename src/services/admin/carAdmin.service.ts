import { connectDB } from '@/lib/db';
import { Car, Brand } from '@/models';
import { slugify } from '@/lib/utils';
import type { CreateCarInput, UpdateCarInput } from '@/validations/admin/car.schema';
import { Types } from 'mongoose';

// ─── Typed admin filter (no more `any`) ──────────────────────────────────────

export interface AdminCarFilters {
    page?: number;
    limit?: number;
    /** Filter by brand ObjectId string */
    brand?: string;
    isSold?: boolean;
    isFeatured?: boolean;
    isActive?: boolean;
    /** Full-text search (requires text index on Car) */
    search?: string;
    /** Default false — admin usually excludes soft-deleted */
    includeDeleted?: boolean;
    /** Exclude a specific car by ID (used by similar cars selector) */
    excludeId?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class CarAdminService {

    // ── Get single car (for edit page — direct DB, no HTTP hop) ──────────────────

    async getCarById(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid car ID');

        const car = await Car.findOne({ _id: id, isDeleted: false })
            .populate('brand', 'name slug logo')
            .populate('similarCars', 'name slug year price images')
            .lean();

        if (!car) throw new Error('Car not found');
        return car;
    }

    // ── List (admin view) ───────────────────────────────────────────────────────

    async getCarsForAdmin(filters: AdminCarFilters) {
        await connectDB();

        const query: Record<string, unknown> = {};

        // Soft-delete filter
        if (!filters.includeDeleted) {
            query['isDeleted'] = false;
        }

        // Brand filter -- validate ObjectId before querying
        if (filters.brand) {
            if (!Types.ObjectId.isValid(filters.brand)) {
                throw new Error('Invalid brand ID');
            }
            query['brand'] = filters.brand;
        }

        if (filters.isSold !== undefined) query['isSold'] = filters.isSold;
        if (filters.isFeatured !== undefined) query['isFeatured'] = filters.isFeatured;
        if (filters.isActive !== undefined) query['isActive'] = filters.isActive;

        // Exclude specific car (similar cars selector — prevent self-reference)
        if (filters.excludeId && Types.ObjectId.isValid(filters.excludeId)) {
            query['_id'] = { $ne: filters.excludeId };
        }

        // Full-text search (requires text index — defined on Car.model.ts)
        if (filters.search?.trim()) {
            query['$text'] = { $search: filters.search.trim() };
        }

        const page = Math.min(1000, Math.max(1, filters.page ?? 1));
        const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
        const skip = (page - 1) * limit;

        const [cars, total] = await Promise.all([
            Car.find(query)
                .populate('brand', 'name slug logo')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Car.countDocuments(query),
        ]);

        return {
            cars,
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
     * Slug generation: try once, catch 11000 and append counter.
     * Clean loop — only the create call is in the retry body.
     */
    async createCar(data: CreateCarInput) {
        await connectDB();

        // Verify brand
        const brand = await Brand.findOne({ _id: data.brand, isDeleted: false }).lean();
        if (!brand) throw new Error('Brand not found');

        const baseSlug = slugify(`${brand.name} ${data.name} ${data.year}`);

        let slug = baseSlug;
        let counter = 0;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                const car = await Car.create({
                    ...data,
                    slug,
                    isActive: true,
                    isDeleted: false,
                    viewsCount: 0,
                });

                // Return populated version
                return Car.findById(car._id)
                    .populate('brand', 'name slug logo')
                    .lean();

            } catch (error: unknown) {
                const isDuplSlug =
                    typeof error === 'object' &&
                    error !== null &&
                    'code' in error &&
                    (error as { code: number }).code === 11000 &&
                    'keyPattern' in error &&
                    'slug' in ((error as { keyPattern: Record<string, unknown> }).keyPattern);

                if (isDuplSlug) {
                    counter++;
                    slug = `${baseSlug}-${counter}`;
                    continue; // retry with new slug
                }

                console.error('[CarAdminService.createCar]', error);
                throw error; // non-slug error → bubble up
            }
        }
    }

    // ── Update ──────────────────────────────────────────────────────────────────

    async updateCar(id: string, data: UpdateCarInput) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid car ID');

        const existing = await Car.findOne({ _id: id, isDeleted: false });
        if (!existing) throw new Error('Car not found');

        // Slug is immutable after creation (SEO — changing slug breaks external links)
        const { slug: _dropped, ...safeData } = data as UpdateCarInput & { slug?: string };
        void _dropped;

        // Verify new brand if changing
        if (safeData.brand && safeData.brand !== existing.brand.toString()) {
            const brand = await Brand.findOne({ _id: safeData.brand, isDeleted: false });
            if (!brand) throw new Error('Brand not found');
        }

        const car = await Car.findByIdAndUpdate(
            id,
            safeData,
            { new: true, runValidators: true },
        )
            .populate('brand', 'name slug logo')
            .lean();

        return car;
    }

    // ── Soft Delete ─────────────────────────────────────────────────────────────

    async softDeleteCar(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid car ID');

        const car = await Car.findOne({ _id: id, isDeleted: false });
        if (!car) throw new Error('Car not found');

        car.isDeleted = true;
        car.isActive = false;
        car.deletedAt = new Date();
        await car.save();

        return car.toObject();
    }

    // ── Toggle Sold ─────────────────────────────────────────────────────────────

    async toggleSold(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid car ID');

        const car = await Car.findOne({ _id: id, isDeleted: false });
        if (!car) throw new Error('Car not found');

        car.isSold = !car.isSold;
        await car.save();

        return car.toObject();
    }

    // ── Toggle Featured ─────────────────────────────────────────────────────────

    async toggleFeatured(id: string) {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid car ID');

        const car = await Car.findOne({ _id: id, isDeleted: false });
        if (!car) throw new Error('Car not found');

        car.isFeatured = !car.isFeatured;
        await car.save();

        return car.toObject();
    }
}
