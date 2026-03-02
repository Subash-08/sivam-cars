import { ShieldCheck } from 'lucide-react';

const benefits = [
    {
        title: 'Highest Market Price',
        desc: 'We offer the best price guaranteed by cutting out middlemen.',
    },
    {
        title: 'Instant Transfer',
        desc: 'Get money in your bank account before you hand over the keys.',
    },
    {
        title: 'Free RC Transfer',
        desc: 'We handle all the RTO paperwork and transfer costs for you.',
    },
    {
        title: 'Zero Commission',
        desc: 'No hidden charges or service fees. You get the full amount.',
    },
] as const;

export default function WhyChooseSection(): React.JSX.Element {
    return (
        <section className="bg-background py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 text-center">
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                        Why Choose{' '}
                        <span className="text-red-600">SivamCars?</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((item) => (
                        <div
                            key={item.title}
                            className="group rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:shadow-xl"
                        >
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors duration-300 group-hover:bg-red-600">
                                <ShieldCheck
                                    size={24}
                                    className="text-foreground transition-colors duration-300 group-hover:text-white"
                                    aria-hidden="true"
                                />
                            </div>
                            <h3 className="mb-3 text-lg font-bold text-foreground">
                                {item.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
