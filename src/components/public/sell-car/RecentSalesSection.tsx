import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface RecentCar {
    model: string;
    price: string;
    location: string;
    image: string;
}

const recentCars: RecentCar[] = [
    {
        model: 'Hyundai Creta SX',
        price: '₹ 11.5 Lakh',
        location: 'Chennai',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141113/creta-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
    },
    {
        model: 'Kia Sonet HTX+',
        price: '₹ 14.2 Lakh',
        location: 'Bangalore',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/174323/sonet-facelift-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
    },
    {
        model: 'Honda City ZX',
        price: '₹ 9.8 Lakh',
        location: 'Coimbatore',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-77.jpeg?isig=0&q=80',
    },
    {
        model: 'Tata Harrier XZ',
        price: '₹ 12.5 Lakh',
        location: 'Salem',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141473/harrier-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
    },
    {
        model: 'Maruti Swift ZXi',
        price: '₹ 6.5 Lakh',
        location: 'Madurai',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/54399/swift-exterior-right-front-three-quarter-64.jpeg?isig=0&q=80',
    },
];

export default function RecentSalesSection(): React.JSX.Element {
    return (
        <section className="bg-muted py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 text-center">
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                        Recently Sold Through{' '}
                        <span className="text-red-600">SivamCars</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        These vehicles were sold at competitive prices with instant
                        payment to the seller.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {recentCars.map((car) => (
                        <div
                            key={car.model}
                            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Image
                                    src={car.image}
                                    alt={`${car.model} recently sold through SivamCars`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                    SOLD
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-foreground">
                                    {car.model}
                                </h3>
                                <p className="mt-1 text-sm font-semibold text-red-600">
                                    {car.price}
                                </p>
                                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin size={12} aria-hidden="true" />
                                    {car.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
