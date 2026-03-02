import { siteConfig } from '@/config/site';
import { Heart, Shield, Users, MapPin, Calendar } from 'lucide-react';

interface StoryHighlight {
    icon: typeof Heart;
    text: string;
}

const storyHighlights: StoryHighlight[] = [
    {
        icon: Heart,
        text: 'Passion for connecting people with reliable vehicles',
    },
    {
        icon: Shield,
        text: 'Every car undergoes a rigorous quality inspection',
    },
    {
        icon: Users,
        text: 'A single-dealer model built on personal accountability',
    },
];

interface StatCard {
    icon: typeof Calendar;
    label: string;
    value: string;
}

const statCards: StatCard[] = [
    { icon: Calendar, label: 'Established', value: 'Since 2018' },
    { icon: MapPin, label: 'Location', value: 'Salem, Tamil Nadu' },
    { icon: Users, label: 'Model', value: 'Single Dealer' },
];

export default function OurStorySection(): React.JSX.Element {
    return (
        <section className="bg-background py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
                    {/* Text Column */}
                    <div className="animate-slide-in">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                            Our Story
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Built on Trust, Driven by Quality
                        </h2>

                        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                            <p>
                                {siteConfig.name} was founded with a simple mission — to make
                                buying a pre-owned car a trustworthy, stress-free experience.
                                In a market often clouded by uncertainty, we set out to bring
                                clarity and confidence to every transaction.
                            </p>
                            <p>
                                Unlike large marketplaces where accountability gets diluted
                                across hundreds of sellers, {siteConfig.name} operates as a
                                single-dealer platform. Every vehicle you see is personally
                                sourced, inspected, and guaranteed by us.
                            </p>
                            <p>
                                Our commitment goes beyond just selling cars. We believe in
                                building lasting relationships through honest pricing, verified
                                documentation, and genuine after-sale support.
                            </p>
                        </div>

                        {/* Inline highlights */}
                        <div className="mt-8 space-y-3">
                            {storyHighlights.map((item) => (
                                <div
                                    key={item.text}
                                    className="flex items-center gap-3 text-sm font-medium text-foreground"
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <item.icon
                                            className="h-4 w-4 text-primary"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Column — Stat cards */}
                    <div className="space-y-4">
                        {statCards.map((card, index) => (
                            <div
                                key={card.label}
                                className="group flex items-center gap-5 rounded-xl border border-border bg-card p-5 transition-all duration-300 card-elevated hover:border-primary/30 hover:-translate-y-0.5"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animationFillMode: 'both',
                                }}
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                                    <card.icon
                                        className="h-6 w-6 text-primary"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        {card.label}
                                    </p>
                                    <p className="mt-0.5 text-lg font-bold text-foreground">
                                        {card.value}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Dealership identity card */}
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                            <p className="text-sm font-semibold text-foreground">
                                {siteConfig.name}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                A single-owner dealership where you deal directly with the
                                person who stands behind every car sold.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
