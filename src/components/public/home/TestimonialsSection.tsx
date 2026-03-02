import Image from 'next/image';
import { Quote } from 'lucide-react';

interface Testimonial {
    name: string;
    role: string;
    content: string;
    avatar: string;
}

const testimonials: Testimonial[] = [
    {
        name: 'Rajesh Kumar',
        role: 'Car Buyer',
        content:
            'Exceeded our expectations with their transparent pricing and honest vehicle history. The entire buying experience was smooth and professional — truly a dealership you can trust.',
        avatar: 'https://i.pravatar.cc/80?img=11',
    },
    {
        name: 'Priya Venkatesh',
        role: 'First-Time Buyer',
        content:
            'As a first-time car buyer, I was nervous about the process. The team guided me through every step, from inspection reports to documentation. I drove home with complete confidence.',
        avatar: 'https://i.pravatar.cc/80?img=5',
    },
    {
        name: 'Mohammed Ashraf',
        role: 'Repeat Customer',
        content:
            'This is my second purchase from SivamCars. Their commitment to quality is consistent — every vehicle is exactly as described. No hidden issues, no surprises.',
        avatar: 'https://i.pravatar.cc/80?img=12',
    },
    {
        name: 'Lakshmi Narayanan',
        role: 'Car Buyer',
        content:
            'The attention to detail here is remarkable. They provided complete service records, genuine mileage verification, and even arranged a test drive at my convenience.',
        avatar: 'https://i.pravatar.cc/80?img=32',
    },
    {
        name: 'Karthik Sundaram',
        role: 'Business Owner',
        content:
            'I needed a reliable vehicle for my business. SivamCars delivered exactly what they promised — a well-maintained car at a fair price with all paperwork in order.',
        avatar: 'https://i.pravatar.cc/80?img=53',
    },
    {
        name: 'Deepa Rajan',
        role: 'Car Buyer',
        content:
            'What sets them apart is the personal accountability. You deal directly with the owner who stands behind every car sold. That level of trust is rare in this industry.',
        avatar: 'https://i.pravatar.cc/80?img=44',
    },
    {
        name: 'Suresh Babu',
        role: 'Returning Customer',
        content:
            'Outstanding after-sale support. Even months after my purchase, they helped me with a service question. A refreshing change from the typical used car experience.',
        avatar: 'https://i.pravatar.cc/80?img=59',
    },
    {
        name: 'Anitha Krishnan',
        role: 'Car Buyer',
        content:
            'From concept to delivery, their process is seamless. The transparent listing with clear photos and honest descriptions made my decision easy. Highly recommended.',
        avatar: 'https://i.pravatar.cc/80?img=23',
    },
];

const firstRow = testimonials.slice(0, 4);
const secondRow = testimonials.slice(4);

function TestimonialCard({ testimonial }: { testimonial: Testimonial }): React.JSX.Element {
    return (
        <div className="group min-w-[240px] cursor-pointer max-w-[280px] shrink-0 rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-500/40 sm:min-w-[300px] sm:max-w-[360px] sm:p-6">
            <Quote
                className="h-5 w-5 text-red-500 sm:h-6 sm:w-6"
                aria-hidden="true"
            />

            <p className="mt-2 text-[13px] leading-relaxed text-foreground sm:mt-4 sm:text-base">
                {testimonial.content}
            </p>

            <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 sm:mt-5 sm:pt-4">
                <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="h-8 w-8 shrink-0 rounded-full border-2 border-red-500/30 object-cover sm:h-10 sm:w-10"
                />
                <div>
                    <p className="text-xs font-semibold text-foreground sm:text-sm">
                        {testimonial.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground sm:text-xs">
                        {testimonial.role}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function TestimonialsSection(): React.JSX.Element {
    return (
        <section className="overflow-hidden bg-background py-10 max-w-7xl mx-auto sm:py-14 md:py-20">
            {/* Header */}
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                {/* Red Badge */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-[10px] sm:px-4 sm:text-xs font-semibold text-white shadow-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Rated 4.8/5 by 500+ Happy Customers
                </div>

                {/* Red Text Accent */}
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-5xl">
                    Trusted by Customers{' '}
                    <span className="text-red-600">Across Salem</span>
                </h2>
            </div>

            {/* Marquee Wrapper with Mask for Blur/Fade Effect */}
            <div className="relative mt-8 sm:mt-14 w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">

                {/* Row 1 — scrolls right */}
                <div className="mx-auto max-w-7xl">
                    <div
                        className="flex w-max animate-scroll-right gap-3 hover:[animation-play-state:paused] sm:gap-6 [--scroll-duration:20s] sm:[--scroll-duration:40s]"
                        style={{ animationDuration: 'var(--scroll-duration)' }}
                    >
                        {[...firstRow, ...firstRow, ...firstRow].map((t, i) => (
                            <TestimonialCard
                                key={`row1-${t.name}-${i}`}
                                testimonial={t}
                            />
                        ))}
                    </div>
                </div>

                {/* Row 2 — scrolls left */}
                <div className="mx-auto mt-4 max-w-7xl sm:mt-6">
                    <div
                        className="flex w-max animate-scroll-left gap-3 hover:[animation-play-state:paused] sm:gap-6 [--scroll-duration:25s] sm:[--scroll-duration:45s]"
                        style={{ animationDuration: 'var(--scroll-duration)' }}
                    >
                        {[...secondRow, ...secondRow, ...secondRow].map((t, i) => (
                            <TestimonialCard
                                key={`row2-${t.name}-${i}`}
                                testimonial={t}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}