import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/auth/login');

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top bar */}
                <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
                    <div className="md:hidden text-foreground font-semibold text-sm">Admin</div>

                    <div className="ml-auto flex items-center gap-3">
                        {/* Notification bell */}
                        <button aria-label="Notifications" className="relative w-9 h-9 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>

                        {/* Divider */}
                        <div className="w-px h-5 bg-border-strong" />

                        {/* User avatar */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold select-none">
                                {session.user?.name?.charAt(0).toUpperCase() ?? 'A'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-foreground text-xs font-semibold leading-none">{session.user?.name ?? 'Admin'}</p>
                                <p className="text-muted-foreground text-xs leading-none mt-0.5">{session.user?.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
