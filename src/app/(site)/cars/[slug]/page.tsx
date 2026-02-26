/**
 * /cars/[slug] — Car Detail Page (Server Component, SSR only)
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CarDetailService } from '@/services/public/car-detail.service';
import { generateDetailMetadata, generateVehicleJsonLd } from '@/lib/seo/vehicle-schema';
import { formatINR, formatKms } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { ImageGallery } from '@/components/public/detail/ImageGallery';
import { StickySidebar } from '@/components/public/detail/StickySidebar';
import { LeadForm } from '@/components/public/detail/LeadForm';
import { OverviewGrid } from '@/components/public/detail/OverviewGrid';
import { FeaturesSection } from '@/components/public/detail/FeaturesSection';
import { SimilarCars } from '@/components/public/detail/SimilarCars';
import { EmiCalculator } from '@/components/public/detail/EmiCalculator';
import { ReelVideosSection } from '@/components/public/detail/ReelVideosSection';

const service = new CarDetailService();

interface Props {
    params: Promise<{ slug: string }>;
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const car = await service.getCarBySlug(slug);


    if (!car) return { title: 'Car Not Found' };
    return generateDetailMetadata(car);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CarDetailPage({ params }: Props) {
    const { slug } = await params;
    const car = await service.getCarBySlug(slug);
    if (!car) notFound();

    const similarCars = await service.getSimilarCars(
        car._id,
        car.brand._id,
        car.bodyType,
        4,
    );

    const jsonLd = generateVehicleJsonLd(car);

    return (
        <>
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="bg-background min-h-screen">
                {/* ── Breadcrumb ───────────────────────────────────────────── */}
                <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                        <li><ChevronRight className="w-3 h-3" /></li>
                        <li><Link href="/buy-cars" className="hover:text-primary transition-colors">Buy Cars</Link></li>
                        <li><ChevronRight className="w-3 h-3" /></li>
                        <li><Link href={`/buy-cars?brand=${car.brand.slug}`} className="hover:text-primary transition-colors">{car.brand.name}</Link></li>
                        <li><ChevronRight className="w-3 h-3" /></li>
                        <li className="text-foreground font-medium truncate max-w-[200px]">{car.year} {car.name}</li>
                    </ol>
                </nav>

                {/* ── Main Two-Column Layout ───────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* LEFT — Scrollable Content */}
                        <div className="flex-1 min-w-0 space-y-8">

                            {/* Image Gallery (includes gallery videos interleaved) */}
                            <ImageGallery
                                images={car.images}
                                videos={car.sliderVideos}
                                carName={car.name}
                            />

                            {/* Title + Key Highlights */}
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                                    {car.year} {car.brand.name} {car.name}
                                </h1>
                                {car.color && (
                                    <p className="text-sm text-muted-foreground mt-1 capitalize">{car.color}</p>
                                )}

                                {/* Key Highlights */}
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {[
                                        { label: String(car.year), icon: '📅' },
                                        { label: formatKms(car.kmsDriven), icon: '🛣️' },
                                        { label: car.fuelType, icon: '⛽' },
                                        { label: car.transmission, icon: '⚙️' },
                                        ...(car.numberOfOwners ? [{ label: `${car.numberOfOwners} Owner${car.numberOfOwners > 1 ? 's' : ''}`, icon: '👤' }] : []),
                                    ].map((item) => (
                                        <span
                                            key={item.label}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-foreground"
                                        >
                                            <span>{item.icon}</span>
                                            {item.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Price — mobile only (desktop shows in sidebar) */}
                            <div className="lg:hidden bg-card rounded-xl p-5 border border-border card-elevated">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Price</p>
                                <p className="text-2xl font-bold text-primary mt-1">{formatINR(car.price)}</p>
                                {car.isSold && (
                                    <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full bg-destructive/10 text-destructive">
                                        Sold
                                    </span>
                                )}
                            </div>

                            {/* Benefits / Reasons to Buy */}
                            {car.benefitsAddons.length > 0 && (
                                <section>
                                    <h2 className="text-lg font-semibold text-foreground mb-4">Reasons to Buy</h2>
                                    <div className="space-y-3">
                                        {car.benefitsAddons.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                                                <span className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                    ✓
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{item.key}</p>
                                                    {item.value && <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Car Overview Grid */}
                            <OverviewGrid car={car} />

                            {/* EMI Calculator */}
                            <EmiCalculator price={car.price} />

                            {/* Features + Dynamic Sections */}
                            <FeaturesSection
                                features={car.features}
                                specifications={car.specifications}
                                keyInformation={car.keyInformation}
                                statsPerformance={car.statsPerformance}
                            />

                            {/* Description */}
                            {car.description && (
                                <section>
                                    <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
                                    <div className="prose prose-sm max-w-none text-secondary-foreground leading-relaxed whitespace-pre-line">
                                        {car.description}
                                    </div>
                                </section>
                            )}

                            {/* ── Lead Form (Mobile) ──── */}
                            {!car.isSold && (
                                <section className="bg-card rounded-xl border border-border p-6 lg:hidden">
                                    <LeadForm carId={car._id} carName={`${car.year} ${car.brand.name} ${car.name}`} />
                                </section>
                            )}

                            {/* Reel Videos — separate section at bottom */}
                            {car.reelVideos.length > 0 && (
                                <ReelVideosSection videos={car.reelVideos} />
                            )}

                            {/* Similar Cars */}
                            {similarCars.length > 0 && (
                                <SimilarCars cars={similarCars} />
                            )}
                        </div>

                        {/* RIGHT — Sticky Sidebar */}
                        <div className="hidden lg:block w-[380px] flex-shrink-0">
                            <StickySidebar car={car} />
                        </div>
                    </div>
                </div>

                {/* Mobile Sticky CTA — fixed bottom bar */}
                {!car.isSold && (
                    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 flex gap-2 lg:hidden z-40">
                        <a
                            href={`tel:${siteConfig.phone}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm transition-colors"
                        >
                            📞 Call Now
                        </a>
                        <a
                            href={`${siteConfig.social.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in the ${car.year} ${car.brand.name} ${car.name}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-success text-primary-foreground font-semibold text-sm transition-colors hover:opacity-90"
                        >
                            💬 WhatsApp
                        </a>
                    </div>
                )}

                {/* Spacer for mobile sticky bar */}
                {!car.isSold && <div className="h-16 lg:hidden" />}
            </div>
        </>
    );
}
