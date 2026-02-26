import Link from 'next/link';
import Image from 'next/image';
import { formatINR, formatKms } from '@/lib/utils';
import type { SimilarCar } from '@/services/public/car-detail.service';

interface SimilarCarsProps {
    cars: SimilarCar[];
}

export function SimilarCars({ cars }: SimilarCarsProps) {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Similar Cars</h2>
                <Link href="/buy-cars" className="text-xs text-primary hover:underline font-medium">
                    View all →
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {cars.map((car) => {
                    const primaryImg = car.images.find((i) => i.isPrimary) ?? car.images[0];
                    return (
                        <Link
                            key={car._id}
                            href={`/cars/${car.slug}`}
                            className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all card-elevated"
                        >
                            <div className="relative aspect-[16/10] bg-muted">
                                {primaryImg?.url ? (
                                    <Image
                                        src={primaryImg.url}
                                        alt={primaryImg.alt ?? car.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-muted-foreground text-xs">No image</span>
                                    </div>
                                )}
                                {car.isFeatured && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary text-primary-foreground">
                                        Featured
                                    </span>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                    {car.year} {car.brand.name} {car.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                                    <span>{formatKms(car.kmsDriven)}</span>
                                    <span>•</span>
                                    <span>{car.fuelType}</span>
                                    <span>•</span>
                                    <span>{car.transmission}</span>
                                </div>
                                <p className="text-sm font-bold text-primary mt-2">{formatINR(car.price)}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
