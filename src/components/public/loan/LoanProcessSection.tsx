import {
    Car,
    Send,
    BadgeCheck,
    PenLine,
    PartyPopper,
} from 'lucide-react';

interface ProcessStep {
    step: number;
    icon: typeof Car;
    title: string;
    description: string;
}

const steps: ProcessStep[] = [
    {
        step: 1,
        icon: Car,
        title: 'Choose Your Car',
        description:
            'Browse our inventory and pick the car that fits your needs and budget.',
    },
    {
        step: 2,
        icon: Send,
        title: 'Submit Loan Enquiry',
        description:
            'Fill out our loan application form with your details and requirements.',
    },
    {
        step: 3,
        icon: BadgeCheck,
        title: 'Loan Approval',
        description:
            'Our banking partners review your application and approve lending quickly.',
    },
    {
        step: 4,
        icon: PenLine,
        title: 'Sign Documents',
        description:
            'Complete the paperwork with minimal documentation for a smooth process.',
    },
    {
        step: 5,
        icon: PartyPopper,
        title: 'Drive Home Your Car',
        description:
            'Once everything is done, drive home your dream car the same day!',
    },
];

export default function LoanProcessSection(): React.JSX.Element {
    return (
        <section className="bg-muted py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        How It Works
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Loan{' '}
                        <span className="text-primary">Process</span>
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        A simple 5-step journey from application to driving home.
                    </p>
                </div>

                {/* Steps */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {steps.map((item) => (
                        <div
                            key={item.title}
                            className="group relative rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg card-elevated"
                        >
                            {/* Step number badge */}
                            <span className="absolute -top-3 left-1/2 inline-flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                {item.step}
                            </span>

                            {/* Icon */}
                            <div className="mx-auto mb-4 mt-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                                <item.icon
                                    className="h-6 w-6 text-primary"
                                    aria-hidden="true"
                                />
                            </div>

                            <h3 className="text-sm font-bold text-foreground sm:text-base">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
