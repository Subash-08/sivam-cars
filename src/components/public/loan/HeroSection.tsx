import Link from 'next/link';

export default function LoanHeroSection(): React.JSX.Element {
    return (
        <section className="relative w-full overflow-hidden bg-muted py-10 md:py-12 lg:py-14">
            {/* Decorative gradient glow */}
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgb(var(--color-primary)/0.10)_0%,_transparent_60%)]"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Left — Content */}
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
                            <span
                                className="h-1.5 w-1.5 rounded-full bg-primary"
                                aria-hidden="true"
                            />
                            Trusted Financing Partners
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Easy Car Loans for{' '}
                            <span className="text-gradient-brand">
                                Your Dream Car
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                            Get instant financing from trusted partners with
                            competitive interest rates. Drive home your dream
                            car today with flexible EMI options.
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="#loan-enquiry-form"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:bg-primary-hover glow-primary"
                            >
                                Apply for Loan
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </Link>

                            <Link
                                href="#emi-calculator"
                                className="inline-flex items-center justify-center rounded-lg border border-border-strong px-8 py-3.5 text-base font-semibold text-foreground transition-all duration-300 hover:scale-[1.03] hover:border-primary/60 hover:bg-muted"
                            >
                                Calculate EMI
                            </Link>
                        </div>
                    </div>

                    {/* Right — Illustration */}
                    <div className="relative hidden lg:block" aria-hidden="true">
                        <div className="relative mx-auto aspect-square w-full max-w-md">
                            {/* Decorative card-style illustration */}
                            <div className="absolute inset-0 rounded-3xl border border-border bg-card/50 backdrop-blur-sm" />

                            {/* Inner visual elements */}
                            <div className="absolute inset-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/50 bg-card p-8">
                                {/* Car icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="64"
                                    height="64"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-primary"
                                >
                                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 1 14v2c0 .6.4 1 1 1h2" />
                                    <circle cx="7" cy="17" r="2" />
                                    <path d="M9 17h6" />
                                    <circle cx="17" cy="17" r="2" />
                                </svg>

                                {/* Decorative stats */}
                                <div className="mt-2 grid w-full grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-border bg-muted p-3 text-center">
                                        <p className="text-2xl font-bold text-primary">9.5%</p>
                                        <p className="text-xs text-muted-foreground">Starting Rate</p>
                                    </div>
                                    <div className="rounded-xl border border-border bg-muted p-3 text-center">
                                        <p className="text-2xl font-bold text-primary">90%</p>
                                        <p className="text-xs text-muted-foreground">Max Financing</p>
                                    </div>
                                    <div className="rounded-xl border border-border bg-muted p-3 text-center">
                                        <p className="text-2xl font-bold text-primary">7 Yrs</p>
                                        <p className="text-xs text-muted-foreground">Max Tenure</p>
                                    </div>
                                    <div className="rounded-xl border border-border bg-muted p-3 text-center">
                                        <p className="text-2xl font-bold text-primary">24h</p>
                                        <p className="text-xs text-muted-foreground">Fast Approval</p>
                                    </div>
                                </div>

                                {/* Glow effect */}
                                <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                                <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual separator */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                aria-hidden="true"
            />
        </section>
    );
}
