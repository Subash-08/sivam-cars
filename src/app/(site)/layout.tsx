import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Script from 'next/script';
import { GoogleAnalyticsTracker } from '@/components/providers/GoogleAnalyticsTracker';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
    title: 'Quality Pre-Owned Cars in Kallakurichi, Attur & Salem | SivamCars',
    description:
        'Browse our handpicked selection of quality used cars in Kallakurichi, Attur and Salem. Trusted single-dealer platform with verified vehicles, transparent pricing, and easy financing.',
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
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `}
            </Script>
            <GoogleAnalyticsTracker />
        </>
    );
}
