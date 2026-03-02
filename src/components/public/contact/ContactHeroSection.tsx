import { siteConfig } from '@/config/site';
import { Phone } from 'lucide-react';

export default function ContactHeroSection(): React.JSX.Element {
    return (
        <section className="relative w-full overflow-hidden bg-muted py-20 md:py-28 lg:py-32">
            <div
                className="absolute inset-0 bg-grid-pattern bg-grid opacity-30"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    Get in Touch with{' '}
                    <span className="text-gradient-brand">{siteConfig.name}</span>
                </h1>

                <p
                    className="mx-auto mt-6 max-w-2xl animate-fade-in text-lg text-muted-foreground sm:text-xl"
                    style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
                >
                    Have questions about a vehicle or need assistance? We&apos;re here to
                    help you find the perfect car with complete transparency and trust.
                </p>

                <div
                    className="mt-10 animate-fade-in"
                    style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
                >
                    <a
                        href={`tel:${siteConfig.phone}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover glow-primary"
                        aria-label={`Call ${siteConfig.name} at ${siteConfig.phone}`}
                    >
                        <Phone className="h-5 w-5" aria-hidden="true" />
                        Call Now
                    </a>
                </div>
            </div>
        </section>
    );
}
