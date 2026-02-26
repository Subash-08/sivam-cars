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
    metadataBase: new URL(siteConfig.url),
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: `${siteConfig.name} — ${siteConfig.tagline}`,
        description: siteConfig.description,
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

