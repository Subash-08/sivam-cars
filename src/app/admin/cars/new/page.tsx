/**
 * Admin — Create Car (Server Component)
 *
 * Uses getServerSession + redirect() — never NextResponse from a page.
 */
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CarFormProvider } from '@/components/admin/car/CarFormProvider';
import { CarFormWizard } from '@/components/admin/car/CarFormWizard';

export const metadata = { title: 'Add New Car | SivamCars Admin' };

export default async function NewCarPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/auth/login');

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Add New Car</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Fill in the details across each step. Slug is auto-generated.
                </p>
            </div>
            <CarFormProvider>
                <CarFormWizard />
            </CarFormProvider>
        </div>
    );
}
