'use client';

import { trackEvent } from '@/lib/analytics';
import { siteConfig } from '@/config/site';
import { Phone, MessageCircle } from 'lucide-react';

interface MobileStickyCTAProps {
    carName: string;
    carYear: number;
    brandName: string;
}

export function MobileStickyCTA({
    carName,
    carYear,
    brandName,
}: MobileStickyCTAProps) {
    const fullCarName = `${carYear} ${brandName} ${carName}`;

    const handleCallClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        trackEvent("click_call", { car_name: fullCarName });
        const url = `tel:${siteConfig.phone}`;
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    };

    const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        trackEvent("click_whatsapp", { car_name: fullCarName });
        const url = `${siteConfig.social.whatsapp}?text=${encodeURIComponent(
            `Hi, I'm interested in the ${fullCarName}`
        )}`;
        setTimeout(() => {
            window.open(url, "_blank");
        }, 150);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 flex gap-2 lg:hidden z-40">
            <a
                href={`tel:${siteConfig.phone}`}
                onClick={handleCallClick}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm transition-colors"
            >
                <Phone className="w-4 h-4" /> Call Now
            </a>
            <a
                href={`${siteConfig.social.whatsapp}?text=${encodeURIComponent(
                    `Hi, I'm interested in the ${fullCarName}`
                )}`}
                onClick={handleWhatsAppClick}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-success text-primary-foreground font-semibold text-sm transition-colors hover:opacity-90"
            >
                <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
        </div>
    );
}
