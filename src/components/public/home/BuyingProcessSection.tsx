import { Search, Heart, PhoneCall, Car } from 'lucide-react';

const steps = [
    {
        num: '01',
        title: 'Browse',
        description: 'Explore our curated selection of quality vehicles online or at our showroom.',
        icon: <Search className="w-6 h-6 text-primary" />,
    },
    {
        num: '02',
        title: 'Shortlist',
        description: 'Compare your favorite models, check specifications, and review our transparent pricing.',
        icon: <Heart className="w-6 h-6 text-primary" />,
    },
    {
        num: '03',
        title: 'Contact Dealer',
        description: 'Schedule a test drive or reach out to our experts to get all your questions answered.',
        icon: <PhoneCall className="w-6 h-6 text-primary" />,
    },
    {
        num: '04',
        title: 'Drive Away',
        description: 'Complete the hassle-free paperwork and drive home in your perfect pre-owned car.',
        icon: <Car className="w-6 h-6 text-primary" />,
    },
];

export function BuyingProcessSection() {
    return (
        <section className="py-20 bg-background overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
                    <p className="mt-4 text-muted-foreground text-lg">
                        Your journey to owning a premium quality car is simple, transparent, and hassle-free.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden lg:block absolute top-[44px] left-[12%] right-[12%] h-0.5 bg-border -z-10" />

                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center relative">
                            <div className="w-24 h-24 bg-card border-4 border-background rounded-full shadow-lg flex flex-col items-center justify-center mb-6 relative">
                                {step.icon}
                                <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground font-bold text-sm rounded-full flex items-center justify-center shadow-md">
                                    {step.num}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
