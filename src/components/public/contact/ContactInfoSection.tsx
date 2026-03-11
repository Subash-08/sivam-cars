import { siteConfig } from '@/config/site';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

interface ContactItem {
    icon: typeof Phone;
    label: string;
    value: string;
    href?: string;
}

export default function ContactInfoSection(): React.JSX.Element {
    const items: ContactItem[] = [
        {
            icon: Phone,
            label: 'Phone',
            value: siteConfig.phone,
            href: `tel:${siteConfig.phone}`,
        },
        ...(siteConfig.social.whatsapp
            ? [
                {
                    icon: MessageCircle,
                    label: 'WhatsApp',
                    value: 'Chat with us on WhatsApp',
                    href: siteConfig.social.whatsapp,
                },
            ]
            : []),
        ...(siteConfig.email
            ? [
                {
                    icon: Mail,
                    label: 'Email',
                    value: siteConfig.email,
                    href: `mailto:${siteConfig.email}`,
                },
            ]
            : []),
        {
            icon: MapPin,
            label: 'Address',
            value: siteConfig.address,
        },
        {
            icon: Clock,
            label: 'Working Hours',
            value: siteConfig.workingHours,
        },
    ];

    return (
        <section className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Contact Information
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        Whether you want to <a href="/used-cars" className="text-primary hover:underline">buy a verified car</a>,{' '}
                        <a href="/sell-car" className="text-primary hover:underline">sell your old vehicle</a>, or{' '}
                        <a href="/loan" className="text-primary hover:underline">get a car loan</a>, reach out to us through any of the channels below.
                    </p>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                        const content = (
                            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 card-elevated hover:-translate-y-0.5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <item.icon
                                        className="h-5 w-5 text-primary"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        {item.label}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        );

                        if (item.href) {
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target={item.href.startsWith('http') ? '_blank' : undefined}
                                    rel={
                                        item.href.startsWith('http')
                                            ? 'noopener noreferrer'
                                            : undefined
                                    }
                                    className="block"
                                    aria-label={`${item.label}: ${item.value}`}
                                >
                                    {content}
                                </a>
                            );
                        }

                        return <div key={item.label}>{content}</div>;
                    })}
                </div>
            </div>
        </section>
    );
}
