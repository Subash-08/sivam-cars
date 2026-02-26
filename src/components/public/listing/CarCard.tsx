import Link from 'next/link';
import Image from 'next/image';
import { Fuel, Gauge, Settings2, Calendar, MapPin } from 'lucide-react';
import type { ListingCar } from '@/types/listing.types';
import { formatINR, formatKms } from '@/lib/utils';

interface CarCardProps {
    car: ListingCar;
    priority?: boolean;
}

export function CarCard({ car, priority = false }: CarCardProps) {
    const thumb = car.images?.find((img) => img.isPrimary) ?? car.images?.[0];
    const kmDisplay = car.kmsDriven > 0 ? formatKms(car.kmsDriven) : 'Brand New';

    return (
        <Link href={`/cars/${car.slug}`} className="group block">
            <article className="bg-card border border-border rounded-xl overflow-hidden card-elevated transition-all duration-200 hover:border-primary/30 hover:shadow-lg h-full flex flex-col">
                {/* ── Thumbnail ─────────────────────────────────────── */}
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                    {thumb?.url ? (
                        <Image
                            src={thumb.url}
                            alt={`${car.year} ${car.brand?.name ?? ''} ${car.name}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={priority}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            No image
                        </div>
                    )}

                    {/* Top-left: Year badge */}
                    <span className="absolute top-2.5 left-2.5 bg-foreground/70 text-primary-foreground text-[11px] px-2 py-0.5 rounded-md font-semibold backdrop-blur-sm">
                        {car.year}
                    </span>

                    {/* Top-right: Featured badge */}
                    {car.isFeatured && (
                        <span className="absolute top-2.5 right-2.5 bg-primary text-primary-foreground text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase">
                            Featured
                        </span>
                    )}

                    {/* Bottom-left: Location */}
                    {car.location?.city && (
                        <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 bg-foreground/60 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                            <MapPin className="w-2.5 h-2.5" />
                            {car.location.city}
                        </span>
                    )}

                    {/* Bottom-right: Body type pill */}
                    <span className="absolute bottom-2.5 right-2.5 bg-card/80 text-foreground text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm border border-border/50">
                        {car.bodyType}
                    </span>
                </div>

                {/* ── Content ───────────────────────────────────────── */}
                <div className="p-4 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="font-semibold text-foreground line-clamp-1 text-[15px] leading-tight">
                        {car.brand?.name} {car.name}
                    </h3>

                    {/* Specs grid — icon-based */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
                        <SpecItem icon={<Gauge className="w-3.5 h-3.5" />} label={kmDisplay} />
                        <SpecItem icon={<Fuel className="w-3.5 h-3.5" />} label={car.fuelType} />
                        <SpecItem icon={<Settings2 className="w-3.5 h-3.5" />} label={car.transmission} />
                        <SpecItem icon={<Calendar className="w-3.5 h-3.5" />} label={`${car.year} Model`} />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border my-3" />

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            <p className="text-lg font-bold text-foreground leading-none">
                                {formatINR(car.price)}
                            </p>
                        </div>
                        <span className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg group-hover:bg-primary-hover transition-colors whitespace-nowrap">
                            View Details
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

// ─── Spec row sub-component ──────────────────────────────────────────────────

function SpecItem({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-1.5 text-muted-foreground">
            {icon}
            <span className="text-xs truncate">{label}</span>
        </div>
    );
}
