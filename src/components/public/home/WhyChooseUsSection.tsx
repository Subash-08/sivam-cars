import { ShieldCheck, BadgeIndianRupee, FileText, Award } from 'lucide-react';
import { siteConfig } from '@/config/site';

const reasons = [
    {
        title: 'Quality Checked Cars',
        description: 'Every vehicle undergoes a rigorous multi-point inspection to ensure absolute reliability and safety.',
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Transparent Pricing',
        description: 'No hidden fees. What you see is exactly what you pay, ensuring peace of mind during your purchase.',
        icon: <BadgeIndianRupee className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Complete Documentation',
        description: 'We handle all the tedious paperwork, transferring RC and maintaining a flawless legal record for every car.',
        icon: <FileText className="w-8 h-8 text-primary" />,
    },
    {
        title: 'Trusted Dealer',
        description: `As ${siteConfig.name}, we've built our reputation on honesty, exceptional service, and premium used cars.`,
        icon: <Award className="w-8 h-8 text-primary" />,
    },
];

export function WhyChooseUsSection() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose {siteConfig.name}?</h2>
                    <p className="mt-4 text-muted-foreground text-lg">
                        We take the risk out of buying used cars by ensuring quality, transparency, and trust every step of the way.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reasons.map((reason, idx) => (
                        <div
                            key={idx}
                            className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                {reason.icon}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{reason.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
