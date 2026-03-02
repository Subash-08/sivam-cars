import { siteConfig } from '@/config/site';
import { Clock, MapPin, Phone, ExternalLink } from 'lucide-react';

export default function AboutLocationSection(): React.JSX.Element {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`;

    return (
        <section className="bg-muted py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        Visit Us
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Your Trusted Dealer in Salem
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        Proudly serving car buyers across Salem, Tamil Nadu. Visit our
                        showroom and experience the {siteConfig.name} difference in person.
                    </p>
                </div>

                <div className="mt-14 grid gap-8 lg:grid-cols-2">
                    {/* Contact Details */}
                    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                        <h3 className="text-xl font-bold text-foreground">
                            {siteConfig.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Quality pre-owned vehicles with transparent pricing and personal
                            service, right here in Salem.
                        </p>

                        <div className="mt-6 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <MapPin
                                        className="h-5 w-5 text-primary"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Address
                                    </p>
                                    <p className="mt-0.5 text-sm text-muted-foreground">
                                        {siteConfig.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Clock
                                        className="h-5 w-5 text-primary"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Working Hours
                                    </p>
                                    <p className="mt-0.5 text-sm text-muted-foreground">
                                        {siteConfig.workingHours}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Phone
                                        className="h-5 w-5 text-primary"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Phone
                                    </p>
                                    <a
                                        href={`tel:${siteConfig.phone}`}
                                        className="mt-0.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                                    >
                                        {siteConfig.phone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-primary-hover"
                                aria-label={`Open ${siteConfig.name} on Google Maps`}
                            >
                                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                Open in Google Maps
                            </a>
                        </div>
                    </div>

                    {/* Map placeholder with local SEO content */}
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-8 text-center lg:min-h-[360px]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <MapPin
                                className="h-8 w-8 text-primary"
                                aria-hidden="true"
                            />
                        </div>
                        <p className="mt-4 text-lg font-bold text-foreground">
                            {siteConfig.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Salem, Tamil Nadu
                        </p>
                        <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground/70">
                            {siteConfig.address}
                        </p>
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                        >
                            View on Google Maps
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
