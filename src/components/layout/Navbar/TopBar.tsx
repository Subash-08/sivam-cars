import { Phone, MapPin } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function TopBar(): React.JSX.Element {
    return (
        <div className="bg-primary text-primary-foreground">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="hidden md:flex items-center justify-between h-9 text-xs font-medium">
                    {/* Promotional message */}
                    <p className="tracking-wide opacity-90">
                        Trusted Dealer — Quality Pre-Owned Cars with Warranty
                    </p>

                    {/* Contact info + CTA */}
                    <div className="flex items-center gap-5">
                        <span className="flex items-center gap-1.5 opacity-90">
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                            <span>Chennai, Tamil Nadu</span>
                        </span>

                        <a
                            href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                            className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity"
                            aria-label={`Call us at ${siteConfig.phone}`}
                        >
                            <Phone className="h-3 w-3" aria-hidden="true" />
                            <span>{siteConfig.phone}</span>
                        </a>

                        <a
                            href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-background/15 px-3 py-0.5 text-xs font-semibold hover:bg-background/25 transition-colors"
                            aria-label="Call now"
                        >
                            <Phone className="h-3 w-3" aria-hidden="true" />
                            Call Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
