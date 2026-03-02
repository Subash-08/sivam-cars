import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function AboutHeroSection(): React.JSX.Element {
    return (
        <section className="relative w-full overflow-hidden bg-muted py-24 md:py-32 lg:py-40">
            {/* Decorative gradient glow */}
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgb(var(--color-primary)/0.08)_0%,_transparent_60%)]"
                aria-hidden="true"
            />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                {/* Badge */}
                <div
                    className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    Trusted Dealer in Salem, Tamil Nadu
                </div>

                <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    More Than Cars.{' '}
                    <span className="text-gradient-brand">
                        A Commitment to Trust.
                    </span>
                </h1>

                <p
                    className="mx-auto mt-6 max-w-2xl animate-fade-in text-lg leading-relaxed text-muted-foreground sm:text-xl"
                    style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
                >
                    {siteConfig.name} is built on a single promise — every vehicle we sell
                    is personally sourced, rigorously inspected, and honestly priced. No
                    middlemen, no surprises.
                </p>

                <div
                    className="mt-10 animate-fade-in"
                    style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
                >
                    <Link
                        href="/used-cars?page=1"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:bg-primary-hover glow-primary"
                    >
                        Explore Our Inventory
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Visual separator — gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />
        </section>
    );
}
