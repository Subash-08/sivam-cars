/**
 * Admin — Edit Car (Server Component)
 *
 * FIX (critique #5): Fetches car via CarAdminService.getCarById() — direct
 * DB call in server component. NOT an HTTP loop through the API.
 *
 * Uses redirect() / notFound() — never NextResponse from a page.
 */
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CarFormProvider } from '@/components/admin/car/CarFormProvider';
import { CarFormWizard } from '@/components/admin/car/CarFormWizard';
import { CarAdminService } from '@/services/admin/carAdmin.service';

export const metadata = { title: 'Edit Car | SivamCars Admin' };

const carService = new CarAdminService();

interface Props {
    params: { id: string };
}

export default async function EditCarPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/auth/login');

    let car;
    try {
        car = await carService.getCarById(params.id);
    } catch {
        notFound();
    }

    if (!car) notFound();

    // Serialize for client — convert ObjectIds and Dates
    const initialData = {
        _id: (car._id as { toString(): string }).toString(),
        name: car.name,
        brand: typeof car.brand === 'object' && car.brand !== null
            ? (car.brand as { _id: { toString(): string } })._id.toString()
            : String(car.brand),
        price: car.price,
        year: car.year,
        kmsDriven: car.kmsDriven,
        fuelType: car.fuelType,
        transmission: car.transmission,
        bodyType: car.bodyType,
        color: car.color ?? '',
        location: car.location ?? { city: '', state: '' },
        registration: car.registration ?? '',
        numberOfOwners: car.numberOfOwners,
        insuranceDetails: car.insuranceDetails ?? '',
        images: (car.images ?? []).map((img: unknown) => {
            const i = img as Record<string, unknown>;
            return {
                url: String(i.url ?? ''),
                publicId: String(i.publicId ?? ''),
                alt: String(i.alt ?? ''),
                isPrimary: !!i.isPrimary,
                order: Number(i.order ?? 0),
            };
        }),
        sliderVideos: (car.sliderVideos ?? []).map((v: unknown) => {
            const vid = v as Record<string, unknown>;
            return {
                url: String(vid.url ?? ''),
                publicId: String(vid.publicId ?? ''),
                order: Number(vid.order ?? 0),
            };
        }),
        reelVideos: (car.reelVideos ?? []).map((v: unknown) => {
            const vid = v as Record<string, unknown>;
            return {
                url: String(vid.url ?? ''),
                publicId: String(vid.publicId ?? ''),
                order: Number(vid.order ?? 0),
            };
        }),
        brochureUrl: car.brochureUrl ?? '',
        features: car.features ?? [],
        specifications: car.specifications ?? [],
        keyInformation: car.keyInformation ?? [],
        statsPerformance: car.statsPerformance ?? [],
        benefitsAddons: car.benefitsAddons ?? [],
        metaTitle: car.metaTitle ?? '',
        metaDesc: car.metaDesc ?? '',
        canonicalUrl: car.canonicalUrl ?? '',
        isFeatured: car.isFeatured ?? false,
        isSold: car.isSold ?? false,
        similarCars: Array.isArray(car.similarCars)
            ? (car.similarCars as unknown[]).map((c) =>
                typeof c === 'object' && c !== null && '_id' in c
                    ? String((c as { _id: unknown })._id)
                    : String(c)
            )
            : [],
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Edit Car</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Editing <span className="font-medium text-foreground">{car.name}</span>
                </p>
            </div>
            <CarFormProvider initialData={initialData} isEditing>
                <CarFormWizard carId={params.id} />
            </CarFormProvider>
        </div>
    );
}
