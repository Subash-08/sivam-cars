import TopBar from '@/components/layout/Navbar/TopBar';
import MainHeader from '@/components/layout/Navbar/MainHeader';
import PrimaryNav from '@/components/layout/Navbar/PrimaryNav';
import { connectDB } from '@/lib/db';
import { Brand } from '@/models';
import type { NavItem } from '@/types';
import { FUEL_TYPES, BODY_TYPES, TRANSMISSIONS } from '@/types/filter.types';

export default async function Navbar(): Promise<React.JSX.Element> {
    await connectDB();

    // Fetch active brands for the Buy Cars dropdown
    const brands = await Brand.find({ isActive: true, isDeleted: false })
        .select('name slug')
        .sort({ name: 1 })
        .lean() as Array<{ name: string; slug: string }>;

    // Build the dynamic nav items array
    const navItems: NavItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Buy Cars', href: '/buy-cars' },
        {
            label: 'Price',
            href: '/buy-cars',
            children: [
                { label: 'Under ₹5 Lakhs', href: '/buy-cars?priceMax=500000' },
                { label: '₹5 Lakhs - ₹10 Lakhs', href: '/buy-cars?priceMin=500000&priceMax=1000000' },
                { label: '₹10 Lakhs - ₹20 Lakhs', href: '/buy-cars?priceMin=1000000&priceMax=2000000' },
                { label: 'Above ₹20 Lakhs', href: '/buy-cars?priceMin=2000000' },
            ]
        },
        {
            label: 'Year',
            href: '/buy-cars',
            children: [
                { label: '2022 & Above', href: '/buy-cars?yearMin=2022' },
                { label: '2019 - 2021', href: '/buy-cars?yearMin=2019&yearMax=2021' },
                { label: '2016 - 2018', href: '/buy-cars?yearMin=2016&yearMax=2018' },
                { label: '2015 & Below', href: '/buy-cars?yearMax=2015' },
            ]
        },
        {
            label: 'Brand',
            href: '/buy-cars',
            children: brands.map((b) => ({
                label: b.name,
                href: `/buy-cars?brand=${b.slug}`
            }))
        },
        {
            label: 'Fuel Type',
            href: '/buy-cars',
            children: FUEL_TYPES.map((f) => ({ label: f, href: `/buy-cars?fuel=${f}` }))
        },
        {
            label: 'Body Type',
            href: '/buy-cars',
            children: BODY_TYPES.map((b) => ({ label: b, href: `/buy-cars?bodyType=${b}` }))
        },
        {
            label: 'Transmission',
            href: '/buy-cars',
            children: TRANSMISSIONS.map((t) => ({ label: t, href: `/buy-cars?transmission=${t}` }))
        },
        { label: 'Sell Cars', href: '/sell' },
        { label: 'Loan', href: '/loan' },
        { label: 'Contact', href: '/contact' },
    ];

    return (
        <header>
            {/* Section 1 — Top promotional bar */}
            <TopBar />

            {/* Section 2 — Logo, search, CTA, Mobile Menu */}
            <MainHeader navItems={navItems} />

            {/* Section 3 — Primary navigation links (desktop only) */}
            <PrimaryNav navItems={navItems} />
        </header>
    );
}
