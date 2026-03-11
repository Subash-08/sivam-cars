import React from 'react';
import Link from 'next/link';
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Clock,
    ChevronRight
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import Image from 'next/image';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    // Navigation Items
    const PUBLIC_NAV_ITEMS = [
        { label: 'Home', href: '/' },
        { label: 'Browse Cars', href: '/cars' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' }
    ];

    // Quick links optimized for SEO Internal Linking
    const quickLinks = {
        popular: [
            { label: 'Used Cars in Attur', href: '/used-cars-in-attur' },
            { label: 'Used Cars in Salem', href: '/used-cars-in-salem' },
            { label: 'Used Cars Under 5 Lakh', href: '/used-cars-under-5-lakh' },
            { label: 'Used SUVs', href: '/used-suv-cars' },
            { label: 'Used Hyundai Cars', href: '/used-hyundai-cars' }
        ],
        resources: [
            { label: 'EMI Calculator', href: '/emi-calculator' },
            { label: 'Car Loan', href: '/loan' },
            { label: 'Sell Your Car', href: '/sell' },
            { label: 'Contact Us', href: '/contact' },
            { label: 'About Us', href: '/about' }
        ]
    };

    // Social icons mapping
    const socialIcons = {
        facebook: Facebook,
        instagram: Instagram,
        twitter: Twitter,
        youtube: Youtube,
        whatsapp: null
    };

    return (
        <footer className="w-full bg-black text-zinc-300 relative overflow-hidden border-t border-white/5">
            {/* Background Blur Effects - Red Theme */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-900/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-8 relative z-10">

                {/* Top Section with Logo and Socials */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-6 border-b border-white/10 ">

                    {/* Brand Section */}
                    <div className="max-w-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <div className="flex-shrink-0 flex items-center justify-center">
                            <Image
                                src="/assets/images/logo-removebg-preview.png"
                                alt={siteConfig.name}
                                width={160}
                                height={75}
                                className="w-[140px] sm:w-[160px] h-auto object-contain"
                            />
                        </div>
                        <p className="text-zinc-400 leading-relaxed text-sm flex-1 flex text-center sm:text-left items-center sm:items-start mt-2 sm:mt-0">
                            {siteConfig.description}
                        </p>
                    </div>

                    {/* Social Links on the Right */}
                    <div className="flex flex-col md:items-end gap-3">
                        <p className="text-sm font-semibold text-white uppercase tracking-wider mb-1">Follow Us</p>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(siteConfig.social).map(([platform, url]) => {
                                if (!url) return null;
                                const Icon = socialIcons[platform as keyof typeof socialIcons];

                                if (platform === 'whatsapp') {
                                    return (
                                        <a
                                            key={platform}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-red-600/10 border border-red-500/20 hover:bg-red-600 text-red-500 hover:text-white p-3 rounded-xl transition-all transform hover:scale-110"
                                        >
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.087-.177.181-.076.355.101.174.449.742.964 1.201.662.591 1.221.774 1.394.861.173.087.274.072.375-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087.159.058 1.003.473 1.175.559.172.086.287.13.33.202.043.072.043.418-.101.823z" />
                                            </svg>
                                        </a>
                                    );
                                }

                                if (Icon) {
                                    return (
                                        <a
                                            key={platform}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white p-3 rounded-xl transition-all transform hover:scale-110"
                                        >
                                            <Icon className="h-5 w-5" />
                                        </a>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-6">

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-red-500" />
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            {PUBLIC_NAV_ITEMS.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-zinc-400 hover:text-white text-sm transition flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-zinc-600 rounded-full group-hover:bg-red-500 transition"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Searches */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-red-500" />
                            Popular Searches
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.popular.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-zinc-400 hover:text-white text-sm transition flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-zinc-600 rounded-full group-hover:bg-red-500 transition"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-red-500" />
                            Resources
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.resources.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-zinc-400 hover:text-white text-sm transition flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-zinc-600 rounded-full group-hover:bg-red-500 transition"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-red-500" />
                            Get in Touch
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 group">
                                <MapPin className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 group-hover:text-red-400 transition-colors" />
                                <div>
                                    <p className="text-white text-sm font-medium">Visit Us</p>
                                    <p className="text-zinc-400 text-sm mt-1">{siteConfig.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                                <Phone className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 group-hover:text-red-400 transition-colors" />
                                <div>
                                    <p className="text-white text-sm font-medium">Call Us</p>
                                    <a href={`tel:${siteConfig.phone}`} className="text-zinc-400 hover:text-white text-sm transition block mt-1">
                                        {siteConfig.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                                <Mail className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 group-hover:text-red-400 transition-colors" />
                                <div>
                                    <p className="text-white text-sm font-medium">Email Us</p>
                                    <a href={`mailto:${siteConfig.email}`} className="text-zinc-400 hover:text-white text-sm transition block mt-1">
                                        {siteConfig.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                                <Clock className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 group-hover:text-red-400 transition-colors" />
                                <div>
                                    <p className="text-white text-sm font-medium">Working Hours</p>
                                    <p className="text-zinc-400 text-sm mt-1">{siteConfig.workingHours}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 mt-2">
                    <div className="flex justify-center items-center">
                        <p className="text-zinc-500 text-sm text-center">
                            © {currentYear} {siteConfig.name}. All rights reserved. |
                            <span className="ml-1 block sm:inline">
                                Designed by <a href="https://nkmoderntechnology.com" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 font-medium transition-colors">NK Modern Technology</a>
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Scroll to Top Button (No JS Required) */}
            <a
                href="#"
                className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-full shadow-lg shadow-red-600/20 transition-all transform hover:scale-110 z-50 border border-white/10"
                aria-label="Scroll to top"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </a>
        </footer>
    );
}