import { type Session } from 'next-auth';

export interface AdminSession extends Session {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface NavItem {
    label: string;
    href: string;
    icon?: string;
    children?: Omit<NavItem, 'children'>[];
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface SiteConfig {
    name: string;
    logo?: string;
    tagline: string;
    description: string;
    url: string;
    phone: string;
    email: string;
    address: string;
    workingHours: string;
    social: {
        whatsapp?: string;
        instagram?: string;
        facebook?: string;
        twitter?: string;
        youtube?: string;
    };
}
