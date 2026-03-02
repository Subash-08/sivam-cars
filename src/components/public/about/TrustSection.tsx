import { Award, MapPin, ShieldCheck } from 'lucide-react';

interface TrustBadge {
    icon: typeof Award;
    title: string;
    description: string;
}

const badges: TrustBadge[] = [
    {
        icon: Award,
        title: 'Years of Automotive Experience',
        description:
            'Our team brings years of hands-on experience in the pre-owned vehicle industry, ensuring knowledgeable guidance at every step.',
    },
    {
        icon: ShieldCheck,
        title: 'Commitment to Quality',
        description:
            'We prioritize single-owner and well-maintained vehicles. Every car in our inventory is selected for its reliability and condition.',
    },
    {
        icon: MapPin,
        title: 'Proudly Based in Salem',
        description:
            'As a locally rooted dealership in Salem, Tamil Nadu, we understand the needs and preferences of our community — and we are here to serve them.',
    },
];

export default function TrustSection(): React.JSX.Element {
    return (
        <section className="bg-muted py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        Built on Trust
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Trust &amp; Credibility
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        Your confidence is our foundation. Here&apos;s why customers trust
                        us with their car-buying journey.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 sm:grid-cols-3 lg:gap-8">
                    {badges.map((badge) => (
                        <div
                            key={badge.title}
                            className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-card p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 sm:p-8"
                        >
                            {/* Subtle shimmer on hover */}
                            <div
                                className="absolute inset-0 bg-[linear-gradient(90deg,_transparent_0%,_rgb(var(--color-primary)/0.03)_50%,_transparent_100%)] bg-[length:200%_100%] opacity-0 transition-opacity duration-500 group-hover:animate-shimmer group-hover:opacity-100"
                                aria-hidden="true"
                            />

                            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15">
                                <badge.icon
                                    className="h-7 w-7 text-primary"
                                    aria-hidden="true"
                                />
                            </div>

                            <h3 className="relative z-10 mt-5 text-base font-bold text-foreground sm:text-lg">
                                {badge.title}
                            </h3>

                            <p className="relative z-10 mt-2 text-sm leading-relaxed text-muted-foreground">
                                {badge.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
