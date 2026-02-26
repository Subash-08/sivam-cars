/**
 * Admin — Create Brand (Server Component)
 *
 * FIX (Issue 6): requireAdmin() throws AuthError — caught by Next.js error boundary.
 * Use redirect('/auth/login') instead of returning NextResponse from a page.
 */
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BrandForm } from '@/components/admin/BrandForm';

export const metadata = { title: 'Create Brand | SivamCars Admin' };

export default async function NewBrandPage() {
    const session = await getServerSession(authOptions);

    // Server component: use redirect(), NOT NextResponse
    if (!session) redirect('/auth/login');

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Create New Brand</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Add a car brand to the inventory system.
                </p>
            </div>
            <BrandForm />
        </div>
    );
}
