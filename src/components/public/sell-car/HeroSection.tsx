import { CheckCircle2, Zap } from 'lucide-react';
import SellCarForm from '@/components/public/sell-car/SellCarForm';

interface HeroSectionProps {
    brands: string[];
}

export default function HeroSection({ brands }: HeroSectionProps): React.JSX.Element {
    return (
        <section className="relative overflow-hidden bg-muted pt-8 pb-6 lg:pt-12 lg:pb-10">
            {/* Background accents */}
            <div
                className="absolute right-0 top-0 z-0 h-full w-1/2 skew-x-12 translate-x-1/4 bg-background/50"
                aria-hidden="true"
            />
            <div
                className="absolute left-10 top-20 h-64 w-64 rounded-full bg-red-500/5 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
                    {/* Left — Content */}
                    <div className="w-full space-y-7 lg:w-1/2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
                            <Zap
                                size={14}
                                className="fill-red-600 text-red-600"
                                aria-hidden="true"
                            />
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Instant Valuation
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Sell Your Car
                            <br />
                            <span className="text-red-600">at the Best Price.</span>
                            <span className="mt-1 block text-foreground/70">
                                Instantly.
                            </span>
                        </h1>

                        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                            Experience the premium way to sell. Free inspection,
                            instant offer, and same-day payment directly to your
                            bank account.
                        </p>

                        <div className="flex flex-wrap gap-6 text-sm font-bold text-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    className="text-red-600"
                                    size={20}
                                    aria-hidden="true"
                                />
                                <span>Free Inspection</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    className="text-red-600"
                                    size={20}
                                    aria-hidden="true"
                                />
                                <span>Instant Offer</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    className="text-red-600"
                                    size={20}
                                    aria-hidden="true"
                                />
                                <span>Same-Day Payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="w-full lg:w-1/2" id="sell-car-form-section">
                        <SellCarForm brands={brands} />
                    </div>
                </div>
            </div>
        </section>
    );
}
