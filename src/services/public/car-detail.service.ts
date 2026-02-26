/**
 * src/services/public/car-detail.service.ts
 *
 * Business logic for the car detail page.
 * Architecture: all DB access in service layer — page.tsx only calls these.
 */

import { connectDB } from '@/lib/db';
import { Car } from '@/models';

// ─── Public-facing car shape (after lean + populate) ─────────────────────────

export interface CarDetail {
    _id: string;
    name: string;
    slug: string;
    brand: { _id: string; name: string; slug: string; logo?: string };
    price: number;
    year: number;
    kmsDriven: number;
    fuelType: string;
    transmission: string;
    bodyType: string;
    color?: string;
    numberOfOwners?: number;
    registration?: string;
    insuranceDetails?: string;
    description?: string;
    features: Array<{ key: string; value: string }>;
    specifications: Array<{ key: string; value: string }>;
    keyInformation: Array<{ key: string; value: string }>;
    statsPerformance: Array<{ key: string; value: string }>;
    benefitsAddons: Array<{ key: string; value: string }>;
    images: Array<{ url: string; publicId: string; alt?: string; isPrimary?: boolean; order?: number }>;
    sliderVideos: Array<{ url: string; publicId: string; order: number }>;
    reelVideos: Array<{ url: string; publicId: string; order: number }>;
    brochureUrl?: string;
    location: { city: string; state: string };
    similarCars: string[];
    isFeatured: boolean;
    isSold: boolean;
    viewsCount: number;
    metaTitle?: string;
    metaDesc?: string;
    canonicalUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SimilarCar {
    _id: string;
    name: string;
    slug: string;
    brand: { _id: string; name: string; slug: string; logo?: string };
    price: number;
    year: number;
    kmsDriven: number;
    fuelType: string;
    transmission: string;
    images: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
    isFeatured: boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class CarDetailService {
    /**
     * Fetch a single car by slug for the public detail page.
     * Excludes deleted/inactive cars. Populates brand. Increments view count.
     */
    async getCarBySlug(slug: string): Promise<CarDetail | null> {
        await connectDB();

        const car = await Car.findOneAndUpdate(
            { slug, isActive: true, isDeleted: false },
            { $inc: { viewsCount: 1 } },
            { new: true },
        )
            .populate('brand', 'name slug logo')
            .lean();

        if (!car) return null;

        const b = car.brand as unknown as Record<string, unknown>;

        return {
            _id: String(car._id),
            name: car.name,
            slug: car.slug,
            brand: {
                _id: String(b._id),
                name: b.name as string,
                slug: b.slug as string,
                logo: b.logo as string | undefined,
            },
            price: car.price,
            year: car.year,
            kmsDriven: car.kmsDriven,
            fuelType: car.fuelType,
            transmission: car.transmission,
            bodyType: car.bodyType,
            color: car.color,
            numberOfOwners: car.numberOfOwners,
            registration: car.registration,
            insuranceDetails: car.insuranceDetails,
            description: car.description,
            features: car.features ?? [],
            specifications: car.specifications ?? [],
            keyInformation: car.keyInformation ?? [],
            statsPerformance: car.statsPerformance ?? [],
            benefitsAddons: car.benefitsAddons ?? [],
            images: (car.images ?? []).map((img) => ({
                url: img.url,
                publicId: img.publicId,
                alt: img.alt,
                isPrimary: img.isPrimary,
                order: img.order,
            })),
            sliderVideos: car.sliderVideos ?? [],
            reelVideos: car.reelVideos ?? [],
            brochureUrl: car.brochureUrl,
            location: car.location,
            similarCars: (car.similarCars ?? []).map((id) => String(id)),
            isFeatured: car.isFeatured,
            isSold: car.isSold,
            viewsCount: car.viewsCount,
            metaTitle: car.metaTitle,
            metaDesc: car.metaDesc,
            canonicalUrl: car.canonicalUrl,
            createdAt: car.createdAt.toISOString(),
            updatedAt: car.updatedAt.toISOString(),
        };
    }

    /**
     * Fetch similar cars by brand + bodyType, excluding the current car.
     * Returns up to `limit` results, sorted newest first.
     */
    async getSimilarCars(
        carId: string,
        brandId: string,
        bodyType: string,
        limit = 4,
    ): Promise<SimilarCar[]> {
        await connectDB();

        const cars = await Car.find({
            _id: { $ne: carId },
            isActive: true,
            isDeleted: false,
            isSold: false,
            $or: [{ brand: brandId }, { bodyType }],
        })
            .select('name slug brand price year kmsDriven fuelType transmission images isFeatured')
            .populate('brand', 'name slug logo')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return cars.map((car) => {
            const b = car.brand as unknown as Record<string, unknown>;
            return {
                _id: String(car._id),
                name: car.name,
                slug: car.slug,
                brand: {
                    _id: String(b._id),
                    name: b.name as string,
                    slug: b.slug as string,
                    logo: b.logo as string | undefined,
                },
                price: car.price,
                year: car.year,
                kmsDriven: car.kmsDriven,
                fuelType: car.fuelType,
                transmission: car.transmission,
                images: (car.images ?? []).map((img) => ({
                    url: img.url,
                    alt: img.alt,
                    isPrimary: img.isPrimary,
                })),
                isFeatured: car.isFeatured,
            };
        });
    }
}
