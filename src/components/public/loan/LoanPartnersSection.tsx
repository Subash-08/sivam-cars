import Image from 'next/image';

interface LoanPartner {
    name: string;
    logo: string;
    description: string;
    rateStartsFrom: string;
}

const partners: LoanPartner[] = [
    {
        name: 'IDFC Bank',
        logo: '/images/partners/idfc-bank.png',
        description:
            'One of India\'s leading private sector banks offering competitive auto loan solutions with quick processing.',
        rateStartsFrom: '9.5%',
    },
    {
        name: 'IndusInd Bank',
        logo: '/images/partners/indusind-bank.png',
        description:
            'Trusted banking partner providing flexible car loan options tailored to your financial needs.',
        rateStartsFrom: '10.0%',
    },
    {
        name: 'Piramal Finance',
        logo: '/images/partners/piramal-finance.png',
        description:
            'A diversified NBFC offering hassle-free car financing with minimal documentation requirements.',
        rateStartsFrom: '10.5%',
    },
    {
        name: 'TVS Credit',
        logo: '/images/partners/tvs-credit.png',
        description:
            'Leading financial services company known for fast approvals and customer-friendly loan terms.',
        rateStartsFrom: '11.0%',
    },
    {
        name: 'Cholamandalam Finance',
        logo: '/images/partners/cholamandalam-finance.png',
        description:
            'Part of the Murugappa Group, offering reliable vehicle financing with wide network coverage.',
        rateStartsFrom: '10.25%',
    },
];

export default function LoanPartnersSection(): React.JSX.Element {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                        Our Partners
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Trusted Lending{' '}
                        <span className="text-primary">Partners</span>
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        We work with India&apos;s top banks and NBFCs to get you
                        the best loan deals.
                    </p>
                </div>

                {/* Top row — 3 cards */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {partners.slice(0, 3).map((partner) => (
                        <PartnerCard key={partner.name} partner={partner} />
                    ))}
                </div>

                {/* Bottom row — 2 cards, centered */}
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-2xl">
                    {partners.slice(3).map((partner) => (
                        <PartnerCard key={partner.name} partner={partner} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PartnerCard({ partner }: { partner: LoanPartner }): React.JSX.Element {
    return (
        <div className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg card-elevated">
            {/* Logo container - Increased height to h-24 and padding to p-4 */}
            <div className="mb-5 flex h-24 items-center justify-center rounded-lg bg-white p-4">
                <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={240}
                    height={80}
                    className="h-52 object-contain"
                />
            </div>

            {/* Divider */}
            <div className="mb-4 h-px bg-border" />

            <h3 className="text-lg font-bold text-foreground">
                {partner.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {partner.description}
            </p>

            {/* Rate badge */}
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                </svg>
                Loans from {partner.rateStartsFrom} p.a.
            </div>
        </div>
    );
}