import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { siteConfig } from '@/config/site';
import AuthProvider from '@/components/providers/AuthProvider';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
    title: {
        default: `${siteConfig.name} — ${siteConfig.tagline}`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
        "used cars kallakurichi",
        "second hand cars kallakurichi",
        "used cars attur",
        "used cars salem",
        "used suv cars",
        "used cars under 5 lakh",
        "used hyundai cars",
        "used kia cars",
        "best used cars under 5 lakh",
        "used suv cars in tamil nadu",
        "second hand cars in attur"
    ],
    metadataBase: new URL(siteConfig.url),
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: `${siteConfig.name} — ${siteConfig.tagline}`,
        description: siteConfig.description,
    },
    twitter: {
        card: 'summary_large_image',
        title: `Used Cars in Kallakurichi | Second Hand Cars | ${siteConfig.name}`,
        description: 'Buy verified used cars in Kallakurichi, Attur and Salem from SivamCars.',
        creator: '@sivamcars',
        images: siteConfig.ogImage ? [siteConfig.ogImage] : [],
    },
    alternates: {
        canonical: siteConfig.url,
        languages: {
            'en-IN': siteConfig.url,
        },
    },
    robots: { index: true, follow: true },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <head>
            </head>
            <body className="min-h-screen bg-background text-foreground antialiased">
                <AuthProvider>
                    {children}
                </AuthProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: 'rgb(var(--color-card))',
                            color: 'rgb(var(--color-foreground))',
                            border: '1px solid rgb(var(--color-border))',
                            fontSize: '0.875rem',
                            borderRadius: '0.5rem',
                        },
                        success: {
                            iconTheme: { primary: 'rgb(var(--color-success))', secondary: '#fff' },
                        },
                        error: {
                            iconTheme: { primary: 'rgb(var(--color-destructive))', secondary: '#fff' },
                        },
                    }}
                />
            </body>
        </html>
    );
}

