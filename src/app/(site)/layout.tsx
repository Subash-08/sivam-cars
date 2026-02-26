import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: 'Quality Pre-Owned Cars in Chennai | SivamCars',
    description:
        'Browse our handpicked selection of quality used cars in Chennai. Trusted single-dealer platform with verified vehicles, transparent pricing, and easy financing.',
};

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
