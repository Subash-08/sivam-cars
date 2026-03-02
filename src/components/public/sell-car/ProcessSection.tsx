import { FileCheck, CheckCircle2, Banknote, Zap } from 'lucide-react';

const steps = [
    {
        icon: FileCheck,
        title: 'Submit Details',
        desc: 'Enter your car details to get an instant valuation.',
    },
    {
        icon: CheckCircle2,
        title: 'Free Inspection',
        desc: 'Schedule a free doorstep inspection at your convenience.',
    },
    {
        icon: Banknote,
        title: 'Instant Offer',
        desc: 'Get a final offer based on the inspection report.',
    },
    {
        icon: Zap,
        title: 'Same-Day Payment',
        desc: 'Money transferred to your account instantly.',
    },
] as const;

export default function ProcessSection(): React.JSX.Element {
    return (
        <section className="bg-background py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-14 text-center">
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                        Sell Your Car in{' '}
                        <span className="text-red-600">4 Simple Steps</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        We&apos;ve streamlined the selling process to be as fast
                        and transparent as possible.
                    </p>
                </div>

                {/* Connecting line (desktop) */}
                <div className="relative">
                    <div
                        className="absolute left-0 top-1/2 z-0 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-red-500/20 via-red-500 to-red-500/20 lg:block"
                        aria-hidden="true"
                    />

                    <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {steps.map((item, i) => (
                            <div
                                key={item.title}
                                className="group rounded-3xl border border-border bg-card p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 transition-colors duration-300 group-hover:bg-red-600 lg:mx-0">
                                    <item.icon
                                        size={32}
                                        className="text-red-600 transition-colors duration-300 group-hover:text-white"
                                        aria-hidden="true"
                                    />
                                    <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-4 border-card bg-foreground text-sm font-bold text-background">
                                        {i + 1}
                                    </div>
                                </div>
                                <h3 className="mb-3 text-center text-lg font-bold text-foreground lg:text-left">
                                    {item.title}
                                </h3>
                                <p className="text-center text-sm leading-relaxed text-muted-foreground lg:text-left">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
