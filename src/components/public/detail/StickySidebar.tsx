'use client';

import { formatINR, formatKms } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import type { CarDetail } from '@/services/public/car-detail.service';
import { Shield, CheckCircle, MapPin, FileText, Calendar, Gauge, Fuel, Settings, Users, Car, Phone, MessageCircle } from 'lucide-react';
import { LeadForm } from '@/components/public/detail/LeadForm';
import { trackEvent } from '@/lib/analytics';

interface StickySidebarProps {
    car: CarDetail;
}

export function StickySidebar({ car }: StickySidebarProps) {
    const fullCarName = `${car.year} ${car.brand.name} ${car.name}`;

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
            `Hi, I'm interested in this car.\n\n• Car: ${fullCarName}\n• Location: ${car.location.city}${car.location.state ? `, ${car.location.state}` : ''}\n\nCould you please share:\n• Final price\n• Availability\n\nCar link: ${siteConfig.url}/cars/${car.slug}`
        )}`;
        setTimeout(() => {
            window.open(url, "_blank");
        }, 150);
    };

    return (
        <aside className="sticky top-24 space-y-5">
            {/* 1. TITLE BLOCK */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-3">
                <h1 className="text-xl font-bold text-foreground">
                    {car.year} {car.brand.name} {car.name}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground flex-wrap">
                    <span>{formatKms(car.kmsDriven)}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{car.fuelType}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-sm text-secondary-foreground">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>
                        {car.location.city}
                        {car.location.state ? `, ${car.location.state}` : ''}
                    </span>
                </div>
            </div>

            {/* 2. PRICE BLOCK */}
            <div className="bg-card  border-gray-300 rounded-xl border border-border p-3 card-elevated">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                    Asking Price
                </p>
                <div className="flex items-end gap-3 flex-wrap">
                    <p className="text-3xl font-bold text-primary leading-none">
                        {formatINR(car.price)}
                    </p>
                    {car.isSold && (
                        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded bg-destructive/10 text-destructive mb-0.5">
                            Sold
                        </span>
                    )}
                    {car.isFeatured && !car.isSold && (
                        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded bg-primary/10 text-primary mb-0.5">
                            Featured
                        </span>
                    )}
                </div>
            </div>


            {/* 3. QUICK HIGHLIGHTS ROW */}
            <div className="bg-card  border-gray-300 rounded-xl border border-border p-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Quick Highlights
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                    <div className="flex items-center gap-2.5 text-sm">
                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-foreground font-medium">{car.year}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                        <Gauge className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-foreground font-medium truncate">
                            {formatKms(car.kmsDriven)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                        <Fuel className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-foreground font-medium">{car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                        <Settings className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-foreground font-medium ">{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                        <Car className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-foreground font-medium truncate">{car.bodyType}</span>
                    </div>
                    {car.numberOfOwners && (
                        <div className="flex items-center gap-2.5 text-sm">
                            <Users className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-foreground font-medium truncate">
                                {car.numberOfOwners} Owner
                            </span>
                        </div>
                    )}
                    {car.color && (
                        <div className="flex items-center gap-2.5 text-sm col-span-2 mt-1">
                            <span
                                className="w-4 h-4 rounded-full border border-border shrink-0 shadow-sm"
                                style={{ backgroundColor: car.color.toLowerCase() }}
                            />
                            <span className="text-foreground font-medium capitalize">
                                {car.color} Color
                            </span>
                        </div>
                    )}
                    {car.registration && (
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <FileText className="w-4 h-4 shrink-0" />
                                <span>Registration</span>
                            </div>
                            <span className="font-semibold text-foreground uppercase">
                                {car.registration}
                            </span>
                        </div>
                    )}
                    {car.insuranceDetails && (
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Shield className="w-4 h-4 shrink-0" />
                                <span>Insurance</span>
                            </div>
                            <span className="font-medium text-foreground text-right max-w-[140px] truncate">
                                {car.insuranceDetails}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. PRIMARY CTA SECTION */}
            {!car.isSold && (
                <div className="flex flex-col gap-3 w-full">
                    <a
                        href={`tel:${siteConfig.phone}`}
                        onClick={handleCallClick}
                        className="w-full flex items-center justify-center gap-2 h-14 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-base transition-colors shadow-sm"
                    >
                        <Phone className="w-5 h-5" /> Call Dealer Now
                    </a>

                    <a
                        href={`${siteConfig.social.whatsapp}?text=${encodeURIComponent(
                            `Hi, I'm interested in this car.\n\n• Car: ${car.year} ${car.brand.name} ${car.name}\n• Location: ${car.location.city}${car.location.state ? `, ${car.location.state}` : ''}\n\nCould you please share:\n• Final price\n• Availability\n\nCar link: ${siteConfig.url}/cars/${car.slug}`
                        )}`}
                        onClick={handleWhatsAppClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 h-14 rounded-xl border-2 border-success text-success font-bold text-base transition-colors hover:bg-success hover:text-primary-foreground"
                    >
                        <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                    </a>
                </div>
            )}


            {/* 6. DETAILS BLOCK */}
            {/* <div className="bg-card rounded-xl border border-border p-3 space-y-3.5">

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="w-4 h-4 shrink-0" />
                        <span>Views</span>
                    </div>
                    <span className="font-medium text-foreground">
                        {car.viewsCount.toLocaleString('en-IN')}
                    </span>
                </div>
            </div> */}

            {/* 5. LEAD FORM BLOCK */}
            {!car.isSold && (
                <div className="bg-card rounded-xl border border-border p-3">
                    <LeadForm
                        carId={car._id}
                        carName={`${car.year} ${car.brand.name} ${car.name}`}
                    />
                </div>
            )}



            {/* 7. TRUST BLOCK */}
            <div className="bg-card rounded-xl border border-border p-3 space-y-4">
                {car.isFeatured && (
                    <div className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle className="w-4 h-4 text-primary" />
                        </span>
                        <div>
                            <p className="font-semibold text-sm text-foreground">
                                Verified & Featured
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Handpicked by {siteConfig.name}
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Shield className="w-4 h-4 text-primary" />
                    </span>
                    <div>
                        <p className="font-semibold text-sm text-foreground">Quality Assured</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Inspected & verified condition
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-primary" />
                    </span>
                    <div>
                        <p className="font-semibold text-sm text-foreground">
                            Complete Documentation
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            RC, insurance & service history ready
                        </p>
                    </div>
                </div>
            </div>

            {/* 8. DEALER INFO */}
            <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">
                    Dealership Info
                </p>
                <p className="text-base font-bold text-foreground">{siteConfig.name}</p>
                <div className="mt-2 space-y-1.5">
                    <p className="text-sm text-secondary-foreground leading-relaxed">
                        {siteConfig.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {siteConfig.workingHours}
                    </p>
                </div>
            </div>
        </aside>
    );
}
