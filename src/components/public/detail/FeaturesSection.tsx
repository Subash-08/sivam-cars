interface KeyValue {
    key: string;
    value: string;
}

interface FeaturesSectionProps {
    features: KeyValue[];
    specifications: KeyValue[];
    keyInformation: KeyValue[];
    statsPerformance: KeyValue[];
}

function SectionBlock({ title, items }: { title: string; items: KeyValue[] }) {
    if (items.length === 0) return null;

    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between py-2.5 border-b border-border last:border-b-0"
                    >
                        <span className="text-sm text-muted-foreground">{item.key}</span>
                        <span className="text-sm font-medium text-foreground text-right max-w-[50%] truncate">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FeaturesSection({ features, specifications, keyInformation, statsPerformance }: FeaturesSectionProps) {
    const hasAny = features.length > 0 || specifications.length > 0 || keyInformation.length > 0 || statsPerformance.length > 0;

    if (!hasAny) return null;

    return (
        <section>
            <h2 className="text-lg font-semibold text-foreground mb-5">Features & Specifications</h2>
            <div className="bg-card rounded-xl border border-border p-5 sm:p-6 space-y-6">
                <SectionBlock title="Features" items={features} />
                <SectionBlock title="Specifications" items={specifications} />
                <SectionBlock title="Key Information" items={keyInformation} />
                <SectionBlock title="Performance" items={statsPerformance} />
            </div>
        </section>
    );
}
