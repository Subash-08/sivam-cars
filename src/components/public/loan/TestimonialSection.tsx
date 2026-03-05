import { Quote } from 'lucide-react';

export default function TestimonialSection(): React.JSX.Element {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        Customer Story
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        What Our Customers{' '}
                        <span className="text-primary">Say</span>
                    </h2>
                </div>

                {/* Testimonial Card */}
                <div className="mt-10 rounded-xl border border-border bg-card p-8 sm:p-10 card-elevated">
                    <Quote
                        className="mb-4 h-8 w-8 text-primary/40"
                        aria-hidden="true"
                    />

                    <blockquote className="text-base leading-relaxed text-foreground sm:text-lg">
                        &ldquo;Getting my car loan through SivamCars was very
                        smooth. The team helped me compare offers from multiple
                        banks and I got a great interest rate. Approval came
                        within one day and I drove home my dream car the same
                        week!&rdquo;
                    </blockquote>

                    <div className="mt-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-sm font-bold text-primary">
                                RK
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Rajesh Kumar
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Salem, Tamil Nadu
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
