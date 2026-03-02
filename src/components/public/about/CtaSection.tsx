import Link from 'next/link';

export default function CtaSection(): React.JSX.Element {
    return (
        <section className="bg-primary py-16 md:py-20">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-xl">
                    Ready to Find Your Next Car?
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
                    Browse our curated inventory of quality pre-owned vehicles or get in
                    touch with our team for personalized assistance.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/used-cars?page=1"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-foreground px-8 py-3.5 text-base font-semibold text-primary transition-opacity hover:opacity-90 sm:w-auto"
                    >
                        View Inventory
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
                        href="/contact"
                        className="inline-flex w-full items-center justify-center rounded-lg border-2 border-primary-foreground/30 px-8 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:border-primary-foreground/60 hover:bg-primary-foreground/10 sm:w-auto"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
