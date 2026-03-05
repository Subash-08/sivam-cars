import {
    TrendingDown,
    Clock,
    Zap,
    FileText,
    Percent,
    Banknote,
} from 'lucide-react';

interface LoanFeature {
    icon: typeof TrendingDown;
    title: string;
    description: string;
}

const features: LoanFeature[] = [
    {
        icon: TrendingDown,
        title: 'Low Interest Rates',
        description:
            'Get competitive interest rates starting from 9.5% per annum from our banking partners.',
    },
    {
        icon: Clock,
        title: 'Flexible Tenure',
        description:
            'Choose a repayment tenure that suits your budget — up to 7 years.',
    },
    {
        icon: Zap,
        title: 'Fast Approval',
        description:
            'Quick loan processing with approvals in as fast as 24 hours.',
    },
    {
        icon: FileText,
        title: 'Minimal Documentation',
        description:
            'Simple paperwork requirements to make your loan journey hassle-free.',
    },
    {
        icon: Percent,
        title: 'Up to 90% Financing',
        description:
            'Finance up to 90% of the car value with easy down payment options.',
    },
    {
        icon: Banknote,
        title: 'Quick Disbursal',
        description:
            'Fast disbursal of your loan amount directly to the dealership account.',
    },
];

export default function LoanFeaturesSection(): React.JSX.Element {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        Why Choose Us
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Loan{' '}
                        <span className="text-primary">Benefits</span>
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        Experience a seamless car loan journey with these
                        advantages.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg card-elevated"
                        >
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                                <feature.icon
                                    className="h-6 w-6 text-primary"
                                    aria-hidden="true"
                                />
                            </div>

                            <h3 className="text-base font-bold text-foreground sm:text-lg">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
