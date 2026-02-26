import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export const metadata: Metadata = {
    title: 'Dashboard',
    robots: { index: false, follow: false },
};

const stats = [
    {
        label: 'Cars Listed',
        value: '0',
        change: 'Add your first car',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z" />
                <circle cx="7.5" cy="17" r="1.5" /><circle cx="16.5" cy="17" r="1.5" />
            </svg>
        ),
        accent: 'text-primary',
        bg: 'bg-primary/10',
    },
    {
        label: 'Active Leads',
        value: '0',
        change: 'No leads yet',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6z" />
            </svg>
        ),
        accent: 'text-success',
        bg: 'bg-success/10',
    },
    {
        label: 'Blog Posts',
        value: '0',
        change: 'Create first post',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
            </svg>
        ),
        accent: 'text-warning',
        bg: 'bg-warning/10',
    },
    {
        label: 'Page Views',
        value: '—',
        change: 'Connect GA4 to view',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        accent: 'text-accent',
        bg: 'bg-accent/10',
    },
];

const quickActions = [
    {
        label: 'Add New Car',
        description: 'List a new used car with photos and specs',
        href: '/admin/cars/new',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
            </svg>
        ),
    },
    {
        label: 'View Leads',
        description: 'Check all inbound enquiries',
        href: '/admin/leads',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
            </svg>
        ),
    },
    {
        label: 'Write Blog Post',
        description: 'Create SEO content for your website',
        href: '/admin/blog/new',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        ),
    },
];

const services = [
    { label: 'MongoDB Atlas', status: 'Connected', ok: true },
    { label: 'NextAuth Session', status: 'Active', ok: true },
    { label: 'Cloudinary', status: 'Set CLOUDINARY_* in .env', ok: false },
    { label: 'n8n Webhook', status: 'Set N8N_WEBHOOK_URL in .env', ok: false },
    { label: 'Google Analytics 4', status: 'Set GA vars in .env', ok: false },
];

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="space-y-8 animate-fade-in">

            {/* Page header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">
                        {greeting}, {session?.user?.name?.split(' ')[0] ?? 'Admin'} 👋
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Here&apos;s what&apos;s happening with your inventory today.
                    </p>
                </div>
                <Link
                    href="/admin/cars/new"
                    className="hidden sm:inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold px-4 h-9 rounded transition-all shadow-sm shadow-primary/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Car
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="relative overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.accent}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                            <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick actions + Status side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Quick actions — takes 2/3 */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks to manage your inventory</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="group flex flex-col gap-3 p-4 bg-muted rounded-lg border border-border hover:border-primary/40 hover:bg-card transition-all"
                                >
                                    <span className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        {action.icon}
                                    </span>
                                    <div>
                                        <p className="text-foreground text-sm font-semibold group-hover:text-primary transition-colors">
                                            {action.label}
                                        </p>
                                        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                                            {action.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* System status — takes 1/3 */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                        <CardDescription>Service connectivity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {services.map((item) => (
                            <div key={item.label} className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-foreground text-xs font-medium">{item.label}</p>
                                    <p className="text-muted-foreground text-xs mt-0.5 leading-tight">{item.status}</p>
                                </div>
                                <span
                                    className={`shrink-0 mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${item.ok
                                            ? 'bg-success/10 text-success border-success/20'
                                            : 'bg-warning/10 text-warning border-warning/20'
                                        }`}
                                >
                                    {item.ok ? '●' : '○'}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
