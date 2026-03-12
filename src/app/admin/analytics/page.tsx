import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export const metadata: Metadata = {
    title: 'Advanced Analytics | SivamCars Admin',
    robots: { index: false, follow: false },
};

export default async function FullAnalyticsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/login');
    }

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full min-h-[calc(100vh-200px)]">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">
                        Marketplace Intelligence
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Comprehensive Google Analytics & Database metrics breakdown.
                    </p>
                </div>
            </div>

            <AnalyticsDashboard variant="detailed" />
        </div>
    );
}
