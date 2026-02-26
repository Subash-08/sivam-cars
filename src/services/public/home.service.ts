import { connectDB } from '@/lib/db';
import { Car, Brand } from '@/models';
import type { ListingCar } from '@/types/listing.types';

export class HomeService {
    // ── Projection (listing view — never return full document) ──────────────────
    private getListProjection() {
        return {
            name: 1,
            slug: 1,
            price: 1,
            year: 1,
            kmsDriven: 1,
            fuelType: 1,
            transmission: 1,
            bodyType: 1,
            color: 1,
            numberOfOwners: 1,
            location: 1,
            isFeatured: 1,
            isSold: 1,
            brand: 1,
            createdAt: 1,
            // First image only for listing thumbnail
            images: { $slice: ['$images', 1] },
        };
    }

    /**
     * Fetch featured cars for the homepage.
     */
    async getFeaturedCars(limit = 6): Promise<ListingCar[]> {
        await connectDB();
        try {
            const cars = await Car.find({
                isActive: true,
                isDeleted: false,
                isSold: false,
                isFeatured: true,
            })
                .populate('brand', 'name slug logo')
                .select(this.getListProjection())
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();

            return cars as unknown as ListingCar[];
        } catch (error) {
            console.error('[HomeService.getFeaturedCars] Error:', error);
            return [];
        }
    }

    /**
     * Fetch recently added cars for the homepage.
     */
    async getRecentCars(limit = 6): Promise<ListingCar[]> {
        await connectDB();
        try {
            const cars = await Car.find({
                isActive: true,
                isDeleted: false,
                isSold: false,
            })
                .populate('brand', 'name slug logo')
                .select(this.getListProjection())
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();

            return cars as unknown as ListingCar[];
        } catch (error) {
            console.error('[HomeService.getRecentCars] Error:', error);
            return [];
        }
    }

    /**
     * Get brands with accurate active car counts > 0
     * Sorted by count descending, limited to top N.
     */
    async getBrandsWithCounts(limit = 10): Promise<Array<{ _id: string; name: string; slug: string; count: number; logo?: string }>> {
        await connectDB();
        try {
            // Advanced aggregation pipeline: only active and unsold inventory
            const brandAgg = await Car.aggregate([
                { $match: { isActive: true, isDeleted: false, isSold: false } },
                { $group: { _id: '$brand', count: { $sum: 1 } } },
                { $match: { count: { $gt: 0 } } },
                { $sort: { count: -1 } },
                { $limit: limit }
            ]);

            if (brandAgg.length === 0) return [];

            const brandIds = brandAgg.map((b) => b._id);

            // Join with Brand collection to get names and slugs
            const brands = await Brand.find({
                _id: { $in: brandIds },
                isActive: true,
                isDeleted: false
            })
                .select('name slug logo')
                .lean();

            // Map results maintaining the aggregate sort order
            const result = brandAgg.map((agg) => {
                const doc = brands.find((d) => String(d._id) === String(agg._id));
                if (!doc) return null;
                return {
                    _id: String(agg._id),
                    name: doc.name,
                    slug: doc.slug,
                    count: agg.count,
                    logo: doc.logo,
                };
            }).filter((b): b is NonNullable<typeof b> => b !== null);

            return result;
        } catch (error) {
            console.error('[HomeService.getBrandsWithCounts] Error:', error);
            return [];
        }
    }

    /**
     * Provide exact integer count of available inventory
     */
    async getTotalActiveCarsCount(): Promise<number> {
        await connectDB();
        try {
            return await Car.countDocuments({
                isActive: true,
                isDeleted: false,
                isSold: false
            });
        } catch (error) {
            console.error('[HomeService.getTotalActiveCarsCount] Error:', error);
            return 0;
        }
    }
}
