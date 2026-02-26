/**
 * Admin — Edit Brand (Server Component)
 *
 * Fetches brand data server-side, passes to BrandForm as initialData.
 * Uses redirect() for auth, notFound() for missing brand — never NextResponse.
 */
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BrandForm } from '@/components/admin/BrandForm';
import { connectDB } from '@/lib/db';
import { Brand } from '@/models';

export const metadata = { title: 'Edit Brand | SivamCars Admin' };

interface Props {
    params: { id: string };
}

export default async function EditBrandPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/auth/login');

    await connectDB();
    const brand = await Brand.findOne({ _id: params.id, isDeleted: false }).lean();
    if (!brand) notFound();

    const initialData = {
        _id: (brand._id as { toString(): string }).toString(),
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo ?? '',
        description: brand.description ?? '',
        metaTitle: brand.metaTitle ?? '',
        metaDesc: brand.metaDesc ?? '',
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Edit Brand</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Updating <span className="font-medium text-foreground">{brand.name}</span>
                </p>
            </div>
            <BrandForm initialData={initialData} isEditing />
        </div>
    );
}
