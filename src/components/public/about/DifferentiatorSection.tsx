import { Search, BadgeIndianRupee, FileCheck, Headset } from 'lucide-react';

interface FeatureCard {
    icon: typeof Search;
    title: string;
    description: string;
}

const features: FeatureCard[] = [
    {
        icon: Search,
        title: 'Thoroughly Inspected Vehicles',
        description:
            'Every car in our inventory undergoes a comprehensive multi-point inspection. We check the engine, transmission, body, electricals, and more — so you can buy with confidence.',
    },
    {
        icon: BadgeIndianRupee,
        title: 'Transparent Pricing',
        description:
            'No hidden charges, no last-minute surprises. Our prices are fair, competitive, and clearly listed — what you see is what you pay.',
    },
    {
        icon: FileCheck,
        title: 'Verified Documentation',
        description:
            'All vehicle documents — RC, insurance, service history, and ownership records — are thoroughly verified before listing.',
    },
    {
        icon: Headset,
        title: 'Personalized Assistance',
        description:
            'From your first enquiry to final delivery, our team offers dedicated, one-on-one support tailored to your needs.',
    },
];

export default function DifferentiatorSection(): React.JSX.Element {
    return (
        <section className="bg-muted py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        Why Choose Us
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        What Makes Us Different
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        We go beyond just listing cars. Here&apos;s what sets us apart from
                        the rest.
                    </p>
                </div>

                {/* Staggered grid — first item spans wider on sm */}
                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 sm:p-8 ${index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                                }`}
                        >
                            {/* Subtle shine on hover */}
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                aria-hidden="true"
                            />

                            <div className="relative">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                                    <feature.icon
                                        className="h-6 w-6 text-primary"
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-foreground">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
