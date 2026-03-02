import { siteConfig } from '@/config/site';
import { MapPin, ExternalLink } from 'lucide-react';

export default function ContactMapSection(): React.JSX.Element {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`;

    return (
        <section className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Find Us
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        Visit our showroom in Salem to explore our vehicles in
                        person.
                    </p>
                </div>

                <div className="mt-12 flex items-center justify-center rounded-xl border border-border bg-muted p-10 lg:min-h-[360px]">
                    <div className="text-center">
                        <MapPin
                            className="mx-auto h-14 w-14 text-muted-foreground/40"
                            aria-hidden="true"
                        />
                        <h3 className="mt-4 text-lg font-semibold text-foreground">
                            {siteConfig.name} — Salem
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                            {siteConfig.address}
                        </p>
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
                            aria-label={`View ${siteConfig.name} on Google Maps`}
                        >
                            <ExternalLink
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            Open in Google Maps
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
