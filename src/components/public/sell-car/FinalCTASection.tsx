import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function FinalCTASection(): React.JSX.Element {
    return (
        <section className="relative overflow-hidden bg-foreground py-20 md:py-28">
            {/* Red glow background */}
            <div
                className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]"
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-background md:text-5xl">
                    Ready to Sell Your Car
                    <span className="text-red-500"> Today?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base text-background/70 md:text-lg">
                    Get the best price for your car with zero hassle. Our team
                    is available to assist you with every step of the process.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="#sell-car-form-section"
                        className="group inline-flex items-center gap-2 rounded-xl bg-red-600 px-8 py-4 font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-500"
                    >
                        <span>Get Instant Offer</span>
                        <ArrowRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </Link>
                    <a
                        href={`tel:${siteConfig.phone}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-background/20 px-8 py-4 font-bold text-background transition-all hover:bg-background/10"
                    >
                        <Phone size={18} aria-hidden="true" />
                        <span>Call Us Now</span>
                    </a>
                </div>

                <p className="mt-6 text-xs text-background/50">
                    ✓ No Hidden Fees · ✓ Free Inspection · ✓ Same-Day Payment
                </p>
            </div>
        </section>
    );
}
