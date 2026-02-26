import type { NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Cars', href: '/admin/cars' },
    { label: 'Brands', href: '/admin/brands' },
    { label: 'Blog', href: '/admin/blog' },
    { label: 'Leads', href: '/admin/leads' },
    { label: 'Homepage', href: '/admin/homepage' },
    { label: 'Analytics', href: '/admin/analytics' },
];

export const PUBLIC_NAV_ITEMS: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Buy Cars', href: '/buy-cars' }, // Handled dynamically in Navbar
    { label: 'Sell Cars', href: '/sell' },
    { label: 'Loan', href: '/loan' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

export const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] as const;

export const TRANSMISSION_TYPES = ['Manual', 'Automatic'] as const;

export const OWNER_OPTIONS = [
    { label: '1st Owner', value: 1 },
    { label: '2nd Owner', value: 2 },
    { label: '3rd Owner', value: 3 },
    { label: '4th Owner+', value: 4 },
] as const;

export const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Lowest KM', value: 'km_asc' },
] as const;

export const PAGINATION_DEFAULTS = {
    PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 50,
} as const;

export const RATE_LIMITS = {
    AUTH_MAX: 5,
    AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    LEAD_MAX: 3,
    LEAD_WINDOW_MS: 10 * 60 * 1000, // 10 minutes
} as const;
