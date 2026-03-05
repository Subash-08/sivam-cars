import { FileText, Briefcase } from 'lucide-react';

interface DocumentGroup {
    icon: typeof FileText;
    title: string;
    items: string[];
}

const documentGroups: DocumentGroup[] = [
    {
        icon: Briefcase,
        title: 'Salaried Person',
        items: [
            'PAN Card',
            'Aadhaar Card',
            'Salary slips (last 3 months)',
            'Bank statements (last 3 months)',
        ],
    },
    {
        icon: FileText,
        title: 'Self-employed',
        items: [
            'PAN Card',
            'Aadhaar Card',
            'ITR returns (last 2 years)',
            'Bank statements (last 6 months)',
        ],
    },
];

export default function RequiredDocumentsSection(): React.JSX.Element {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        Documentation
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Required{' '}
                        <span className="text-primary">Documents</span>
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        Keep these documents ready for a smooth loan application
                        process.
                    </p>
                </div>

                {/* Two columns */}
                <div className="mt-12 grid gap-8 sm:grid-cols-2">
                    {documentGroups.map((group) => (
                        <div
                            key={group.title}
                            className="rounded-xl border border-border bg-card p-6 sm:p-8 card-elevated"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <group.icon
                                        className="h-5 w-5 text-primary"
                                        aria-hidden="true"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">
                                    {group.title}
                                </h3>
                            </div>

                            <ul className="space-y-3">
                                {group.items.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-2.5 text-sm text-foreground sm:text-base"
                                    >
                                        <span
                                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                                            aria-hidden="true"
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
