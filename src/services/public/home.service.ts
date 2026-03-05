import { connectDB } from '@/lib/db';
import { Car, Brand, HomeSection, CustomerStory } from '@/models';
import type { LayoutType } from '@/models';
import type { ListingCar } from '@/types/listing.types';

// ─── Public home section type ─────────────────────────────────────────────────

export interface PublicHomeSection {
    _id: string;
    title: string;
    subtitle?: string;
    layoutType: LayoutType;
    order: number;
    viewAllText?: string;
    viewAllLink?: string;
    cars: ListingCar[];
}

// ─── Public customer story type ───────────────────────────────────────────────

export interface PublicCustomerStory {
    _id: string;
    customerName: string;
    location: string;
    testimonial: string;
    imageUrl: string;
    order: number;
}

// ─── Homepage brand type ──────────────────────────────────────────────────────

export interface HomepageBrand {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    carCount: number;
}

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
            const brandAgg = await Car.aggregate([
                { $match: { isActive: true, isDeleted: false, isSold: false } },
                { $group: { _id: '$brand', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: limit }
            ]);

            const brandIds = brandAgg.map((b) => b._id);

            const brands = await Brand.find({
                _id: { $in: brandIds },
                isActive: true,
                isDeleted: false
            })
                .select('name slug logo')
                .lean();

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

    /**
     * Fetch active homepage sections with populated car data.
     */
    async getActiveHomeSections(): Promise<PublicHomeSection[]> {
        await connectDB();
        try {
            const sections = await HomeSection.find({ isActive: true })
                .populate({
                    path: 'cars',
                    match: { isActive: true, isDeleted: false, isSold: false },
                    select: this.getListProjection(),
                    populate: { path: 'brand', select: 'name slug logo' },
                })
                .sort({ order: 1 })
                .lean();

            return sections
                .map((section) => ({
                    _id: String(section._id),
                    title: section.title,
                    subtitle: section.subtitle,
                    layoutType: section.layoutType,
                    order: section.order,
                    viewAllText: section.viewAllText,
                    viewAllLink: section.viewAllLink,
                    cars: (section.cars ?? []) as unknown as ListingCar[],
                }))
                .filter((s) => s.cars.length > 0);
        } catch (error) {
            console.error('[HomeService.getActiveHomeSections] Error:', error);
            return [];
        }
    }

    /**
     * Fetch active customer delivery stories, sorted by order ASC.
     */
    async getActiveCustomerStories(): Promise<PublicCustomerStory[]> {
        await connectDB();
        try {
            const stories = await CustomerStory.find({ isActive: true })
                .select('customerName location testimonial imageUrl order')
                .sort({ order: 1 })
                .lean();

            return stories.map((s) => ({
                _id: String(s._id),
                customerName: s.customerName,
                location: s.location,
                testimonial: s.testimonial,
                imageUrl: s.imageUrl,
                order: s.order,
            }));
        } catch (error) {
            console.error('[HomeService.getActiveCustomerStories] Error:', error);
            return [];
        }
    }

    /**
     * Fetch admin-curated brands for homepage display.
     * Returns brands with showOnHomepage=true, sorted by homepageOrder.
     * Includes car count per brand (only active, non-deleted, non-sold cars).
     * Limited to 12 brands max.
     */
    async getHomepageBrands(): Promise<HomepageBrand[]> {
        await connectDB();
        try {
            const brands = await Brand.find({
                showOnHomepage: true,
                isActive: true,
                isDeleted: false,
            })
                .select('name slug logo homepageOrder')
                .sort({ homepageOrder: 1 })
                .limit(12)
                .lean();

            if (brands.length === 0) return [];

            // Aggregate car counts per brand
            const brandIds = brands.map((b) => b._id);
            const carCounts = await Car.aggregate([
                { $match: { brand: { $in: brandIds }, isActive: true, isDeleted: false, isSold: false } },
                { $group: { _id: '$brand', count: { $sum: 1 } } },
            ]);

            const countMap = new Map(carCounts.map((c) => [String(c._id), c.count as number]));

            return brands.map((b) => ({
                _id: String(b._id),
                name: b.name,
                slug: b.slug,
                logo: b.logo,
                carCount: countMap.get(String(b._id)) ?? 0,
            }));
        } catch (error) {
            console.error('[HomeService.getHomepageBrands] Error:', error);
            return [];
        }
    }
}
