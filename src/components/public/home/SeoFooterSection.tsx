import { siteConfig } from '@/config/site';
import Link from 'next/link';

export function SeoFooterSection() {
    return (
        <section className="py-12 bg-muted/10 border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center sm:text-left">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                        Your Trusted Partner for Quality Pre-Owned Cars
                    </h2>
                    <div className="text-sm text-muted-foreground leading-relaxed space-y-4 max-w-4xl mx-auto sm:mx-0">
                        <p>
                            Searching for reliable used cars doesn’t have to be complicated. At {siteConfig.name}, we pride ourselves on offering a meticulously inspected selection of pre-owned vehicles tailored to every lifestyle and budget. Whether you need a spacious SUV for family trips, a fuel-efficient hatchback for city commuting, or a premium sedan for business travel, our inventory is curated to meet stringent quality standards.
                        </p>
                        <p>
                            We prioritize transparency and customer satisfaction above all else. Every vehicle in our showroom comes with a detailed history and clear pricing.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-8">
                    <div>
                        <h3 className="font-semibold mb-4 text-sm text-foreground">Browse by Budget</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/used-cars-under-2-lakh" className="hover:text-primary transition-colors">Cars Under 2 Lakh</Link></li>
                            <li><Link href="/used-cars-under-3-lakh" className="hover:text-primary transition-colors">Cars Under 3 Lakh</Link></li>
                            <li><Link href="/used-cars-under-5-lakh" className="hover:text-primary transition-colors">Cars Under 5 Lakh</Link></li>
                            <li><Link href="/used-cars-under-10-lakh" className="hover:text-primary transition-colors">Cars Under 10 Lakh</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-sm text-foreground">Browse by City</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/used-cars-in-kallakurichi" className="hover:text-primary transition-colors">Used Cars in Kallakurichi</Link></li>
                            <li><Link href="/used-cars-in-attur" className="hover:text-primary transition-colors">Used Cars in Attur</Link></li>
                            <li><Link href="/used-cars-in-salem" className="hover:text-primary transition-colors">Used Cars in Salem</Link></li>
                            <li><Link href="/used-cars-in-ulundurpet" className="hover:text-primary transition-colors">Used Cars in Ulundurpet</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-sm text-foreground">Browse by Body Type</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/used-suv-cars" className="hover:text-primary transition-colors">Used SUVs</Link></li>
                            <li><Link href="/used-sedan-cars" className="hover:text-primary transition-colors">Used Sedans</Link></li>
                            <li><Link href="/used-hatchback-cars" className="hover:text-primary transition-colors">Used Hatchbacks</Link></li>
                            <li><Link href="/used-muv-cars" className="hover:text-primary transition-colors">Used MUVs</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-sm text-foreground">Browse by Fuel</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/used-petrol-cars" className="hover:text-primary transition-colors">Used Petrol Cars</Link></li>
                            <li><Link href="/used-diesel-cars" className="hover:text-primary transition-colors">Used Diesel Cars</Link></li>
                            <li><Link href="/used-electric-cars" className="hover:text-primary transition-colors">Used Electric Cars</Link></li>
                            <li><Link href="/used-cng-cars" className="hover:text-primary transition-colors">Used CNG Cars</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
