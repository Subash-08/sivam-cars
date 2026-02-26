import { formatKms } from '@/lib/utils';
import type { CarDetail } from '@/services/public/car-detail.service';

interface OverviewGridProps {
    car: CarDetail;
}

const ICON_MAP: Record<string, string> = {
    'Make Year': '📅',
    'Km Driven': '🛣️',
    'Fuel Type': '⛽',
    'Transmission': '⚙️',
    'Body Type': '🚗',
    'Color': '🎨',
    'Owners': '👤',
    'Registration': '📋',
    'Insurance': '🛡️',
    'Location': '📍',
};

export function OverviewGrid({ car }: OverviewGridProps) {
    const items: Array<{ label: string; value: string }> = [
        { label: 'Make Year', value: String(car.year) },
        { label: 'Km Driven', value: formatKms(car.kmsDriven) },
        { label: 'Fuel Type', value: car.fuelType },
        { label: 'Transmission', value: car.transmission },
        { label: 'Body Type', value: car.bodyType },
    ];

    if (car.color) items.push({ label: 'Color', value: car.color });
    if (car.numberOfOwners) items.push({ label: 'Owners', value: `${car.numberOfOwners} Owner${car.numberOfOwners > 1 ? 's' : ''}` });
    if (car.registration) items.push({ label: 'Registration', value: car.registration });
    if (car.insuranceDetails) items.push({ label: 'Insurance', value: car.insuranceDetails });
    items.push({ label: 'Location', value: `${car.location.city}${car.location.state ? `, ${car.location.state}` : ''}` });

    return (
        <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Car Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="bg-card rounded-lg border border-border p-3.5 flex items-start gap-3"
                    >
                        <span className="text-lg flex-shrink-0 mt-0.5">{ICON_MAP[item.label] ?? '📌'}</span>
                        <div className="min-w-0">
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{item.label}</p>
                            <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
