import { CheckCircle } from 'lucide-react';

const eligibilityItems: string[] = [
    'Age between 21–65 years',
    'Stable source of income (salaried or self-employed)',
    'Valid identity proof (PAN Card / Aadhaar)',
    'Address proof (utility bill / Aadhaar)',
    'Bank statements (last 3–6 months)',
];

export default function EligibilitySection(): React.JSX.Element {
    return (
        <section className="bg-muted py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        Eligibility
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Who Can{' '}
                        <span className="text-primary">Apply?</span>
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        Check if you meet the basic eligibility requirements for
                        a car loan.
                    </p>
                </div>

                {/* List */}
                <div className="mt-10 rounded-xl border border-border bg-card p-6 sm:p-8 card-elevated">
                    <ul className="space-y-4">
                        {eligibilityItems.map((item) => (
                            <li
                                key={item}
                                className="flex items-start gap-3"
                            >
                                <CheckCircle
                                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <span className="text-sm text-foreground sm:text-base">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
