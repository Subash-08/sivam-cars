import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function PrimaryCTASection(): React.JSX.Element {
    return (
        <section
            className="relative w-full overflow-hidden bg-primary py-10 md:py-14"
            aria-label="Call To Action"
        >
            {/* Radial glow background */}
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgb(var(--color-primary-hover)/0.15)_0%,_transparent_70%)]"
                aria-hidden="true"
            />

            {/* Shimmer overlay */}
            <div
                className="absolute inset-0 animate-shimmer bg-[length:200%_100%] bg-[linear-gradient(90deg,_transparent_0%,_rgb(255_255_255/0.04)_50%,_transparent_100%)] opacity-60"
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="animate-fade-in text-4xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-6xl">
                    Ready to Drive Home Your Next Car?
                </h2>

                <p
                    className="mx-auto mt-5 max-w-2xl animate-fade-in text-base text-primary-foreground/80 sm:text-lg"
                    style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
                >
                    At {siteConfig.name}, we believe every car buyer deserves
                    transparency, quality, and a stress-free experience. Let us help you
                    find the perfect ride.
                </p>

                {/* CTA Buttons */}
                <div
                    className="mt-10 flex animate-fade-in flex-col items-center justify-center gap-4 sm:flex-row"
                    style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
                >
                    <Link
                        href="/used-cars?page=1"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-background px-8 py-3.5 text-base font-semibold text-primary transition-all duration-300 hover:scale-[1.03] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:w-auto"
                    >
                        Browse Available Cars
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

                    <Link
                        href="/contact"
                        className="inline-flex w-full items-center justify-center rounded-lg border border-primary-foreground/40 px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:border-primary-foreground/70 hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:w-auto"
                    >
                        Contact Our Team
                    </Link>
                </div>

                {/* Trust micro copy */}
                <p
                    className="mx-auto mt-8 animate-fade-in text-xs text-primary-foreground/60 sm:text-sm"
                    style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
                >
                    ✔ Transparent Pricing &nbsp;•&nbsp; ✔ Verified Vehicles &nbsp;•&nbsp;
                    ✔ Trusted Dealer in Salem
                </p>
            </div>
        </section>
    );
}
