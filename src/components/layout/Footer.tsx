'use client';

import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { PUBLIC_NAV_ITEMS } from '@/constants';
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Clock,
    ChevronRight,
    Shield,
    Award,
    Headphones,
    Car,
    FileText,
    HelpCircle
} from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Quick links for different sections
    const quickLinks = {
        popular: [
            { label: 'New Cars', href: '/cars?sort=newest' },
            { label: 'Featured Cars', href: '/cars?featured=true' },
            { label: 'Under ₹5 Lakh', href: '/cars?maxPrice=500000' },
            { label: 'SUVs', href: '/cars?bodyType=SUV' },
            { label: 'Electric Cars', href: '/cars?fuelType=Electric' }
        ],
        resources: [
            { label: 'EMI Calculator', href: '/emi-calculator' },
            { label: 'Car Loan', href: '/loan' },
            { label: 'Sell Your Car', href: '/sell' },
            { label: 'Blog', href: '/blog' },
            { label: 'FAQs', href: '/faqs' }
        ]
    };

    // Social icons mapping
    const socialIcons = {
        facebook: Facebook,
        instagram: Instagram,
        twitter: Twitter,
        youtube: Youtube,
        whatsapp: null // Special case
    };

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Top Section with Logo and Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12 border-b border-gray-800">
                    {/* Brand Section with Enhanced Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            {siteConfig.logo ? (
                                <Image
                                    src={siteConfig.logo}
                                    alt={siteConfig.name}
                                    width={48}
                                    height={48}
                                    className="rounded-lg"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Car className="h-6 w-6 text-white" />
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-white">{siteConfig.name}</h2>
                        </div>

                        <p className="text-gray-400 leading-relaxed max-w-lg">
                            {siteConfig.description}
                        </p>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                                <Award className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm">10+ Years Trust</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                                <Shield className="h-4 w-4 text-green-500" />
                                <span className="text-sm">100% Verified Cars</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                                <Headphones className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">24/7 Support</span>
                            </div>
                        </div>

                        {/* Social Links with Icons */}
                        <div className="flex gap-3">
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
                                            aria-label={`${platform} chat`}
                                            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-all transform hover:scale-110"
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
                                            aria-label={platform}
                                            className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white p-3 rounded-xl transition-all transform hover:scale-110"
                                        >
                                            <Icon className="h-5 w-5" />
                                        </a>
                                    );
                                }

                                return null;
                            })}
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-800">
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Get Latest Car Deals
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Subscribe to get notified about new arrivals and exclusive offers
                        </p>

                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all transform hover:scale-105 whitespace-nowrap"
                                >
                                    Subscribe
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">
                                By subscribing, you agree to our Privacy Policy and consent to receive updates
                            </p>
                        </form>

                        {/* App Store Badges */}
                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
                            <a href="#" className="flex items-center gap-2 bg-black px-4 py-2 rounded-xl hover:bg-gray-900 transition">
                                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                <div>
                                    <div className="text-xs text-gray-400">Download on</div>
                                    <div className="text-sm font-semibold text-white">App Store</div>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-2 bg-black px-4 py-2 rounded-xl hover:bg-gray-900 transition">
                                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 20.5v-17c0-.28.22-.5.5-.5h17c.28 0 .5.22.5.5v17c0 .28-.22.5-.5.5h-17c-.28 0-.5-.22-.5-.5zm6.5-12h-2v9h2v-9zm1 0v9h2v-9h-2zm5-2h-2v11h2v-11zm1 0h2v11h-2v-11z" />
                                </svg>
                                <div>
                                    <div className="text-xs text-gray-400">Get it on</div>
                                    <div className="text-sm font-semibold text-white">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Links Grid - Enhanced with Icons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
                    {/* Navigation */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-blue-500" />
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            {PUBLIC_NAV_ITEMS.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-500 transition"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Searches */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-blue-500" />
                            Popular Searches
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.popular.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-500 transition"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-blue-500" />
                            Resources
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.resources.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-500 transition"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information with Icons */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-blue-500" />
                            Get in Touch
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white text-sm font-medium">Visit Us</p>
                                    <p className="text-gray-400 text-sm">{siteConfig.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white text-sm font-medium">Call Us</p>
                                    <a href={`tel:${siteConfig.phone}`} className="text-gray-400 hover:text-white text-sm transition block">
                                        {siteConfig.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white text-sm font-medium">Email Us</p>
                                    <a href={`mailto:${siteConfig.email}`} className="text-gray-400 hover:text-white text-sm transition block">
                                        {siteConfig.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white text-sm font-medium">Working Hours</p>
                                    <p className="text-gray-400 text-sm">{siteConfig.workingHours}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Enhanced with more links */}
                <div className="border-t border-gray-800 pt-8 mt-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm text-center lg:text-left">
                            &copy; {currentYear} {siteConfig.name}. All rights reserved. |
                            <span className="ml-1">Designed with ❤️ for car enthusiasts</span>
                        </p>

                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Terms
                            </Link>
                            <Link href="/sitemap" className="text-gray-500 hover:text-gray-300 text-sm transition flex items-center gap-1">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                                Sitemap
                            </Link>
                            <Link href="/disclaimer" className="text-gray-500 hover:text-gray-300 text-sm transition flex items-center gap-1">
                                <HelpCircle className="h-3 w-3" />
                                Disclaimer
                            </Link>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex justify-center lg:justify-end items-center gap-4 mt-6">
                        <span className="text-gray-500 text-xs">We Accept:</span>
                        <div className="flex gap-2">
                            <div className="bg-gray-800 px-3 py-1.5 rounded text-xs text-gray-400">Visa</div>
                            <div className="bg-gray-800 px-3 py-1.5 rounded text-xs text-gray-400">Mastercard</div>
                            <div className="bg-gray-800 px-3 py-1.5 rounded text-xs text-gray-400">UPI</div>
                            <div className="bg-gray-800 px-3 py-1.5 rounded text-xs text-gray-400">NetBanking</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 z-50"
                aria-label="Scroll to top"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </footer>
    );
}