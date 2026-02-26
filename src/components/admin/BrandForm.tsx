'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createBrandSchema } from '@/validations/admin/brand.schema';
import type { CreateBrandInput } from '@/validations/admin/brand.schema';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BrandFormProps {
    /** Pass existing brand data when editing */
    initialData?: Partial<CreateBrandInput> & { _id?: string };
    isEditing?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BrandForm({ initialData, isEditing = false }: BrandFormProps) {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateBrandInput>({
        resolver: zodResolver(createBrandSchema),
        defaultValues: {
            name: initialData?.name ?? '',
            description: initialData?.description ?? '',
            metaTitle: initialData?.metaTitle ?? '',
            metaDesc: initialData?.metaDesc ?? '',
            logo: initialData?.logo ?? '',
        },
    });

    const logoUrl = watch('logo');

    // ── Image upload ────────────────────────────────────────────────────────────

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side UX validation only (server enforces real limits)
        if (!file.type.startsWith('image/')) {
            toast.error('Please choose an image file (JPEG, PNG, WebP, SVG)');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be under 2 MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'brands');

            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const data = await res.json() as { success: boolean; url?: string; error?: string };

            if (data.success && data.url) {
                setValue('logo', data.url, { shouldValidate: true });
                toast.success('Logo uploaded');
            } else {
                toast.error(data.error ?? 'Upload failed');
            }
        } catch {
            toast.error('Network error — upload failed');
        } finally {
            setUploading(false);
            // Reset the input so same file can be re-uploaded after an error
            e.target.value = '';
        }
    };

    // ── Form submit ─────────────────────────────────────────────────────────────

    const onSubmit = async (data: CreateBrandInput) => {
        const url = isEditing ? `/api/admin/brands/${initialData?._id}` : '/api/admin/brands';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json() as { success: boolean; error?: string };

            if (result.success) {
                toast.success(isEditing ? 'Brand updated' : 'Brand created');
                router.push('/admin/brands');
                router.refresh();
            } else {
                toast.error(result.error ?? 'Failed to save brand');
            }
        } catch {
            toast.error('Network error — please try again');
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">

            {/* Logo upload */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Brand Logo
                </label>
                <div className="flex items-start gap-5">
                    {/* Preview */}
                    <div className="relative w-28 h-28 rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {logoUrl ? (
                            <>
                                <Image src={logoUrl} alt="Logo preview" fill className="object-contain p-2" />
                                <button
                                    type="button"
                                    onClick={() => setValue('logo', '', { shouldValidate: true })}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive/90 text-primary-foreground flex items-center justify-center hover:bg-destructive"
                                    aria-label="Remove logo"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </>
                        ) : (
                            <div className="text-center">
                                <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-1" />
                                <span className="text-xs text-muted-foreground">Logo</span>
                            </div>
                        )}
                    </div>

                    {/* File input */}
                    <div className="flex flex-col gap-2 pt-1">
                        <input
                            id="logo-upload"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/svg+xml"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="sr-only"
                        />
                        <label
                            htmlFor="logo-upload"
                            className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 text-sm font-medium rounded-lg border border-border-strong bg-card hover:bg-card-hover text-foreground transition-colors duration-150 disabled:opacity-50"
                        >
                            <Upload className="w-4 h-4" />
                            {uploading ? 'Uploading…' : 'Choose Image'}
                        </label>
                        <p className="text-xs text-muted-foreground">JPEG · PNG · WebP · SVG — max 2 MB</p>
                        {errors.logo && (
                            <p className="text-xs text-destructive">{errors.logo.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Brand Name */}
            <div>
                <label htmlFor="brand-name" className="block text-sm font-medium text-foreground mb-1">
                    Brand Name <span className="text-destructive">*</span>
                </label>
                <Input
                    id="brand-name"
                    placeholder="e.g. Maruti Suzuki"
                    error={errors.name?.message}
                    {...register('name')}
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="brand-desc" className="block text-sm font-medium text-foreground mb-1">
                    Description
                </label>
                <Textarea
                    id="brand-desc"
                    placeholder="Brief description of the brand…"
                    rows={4}
                    {...register('description')}
                />
            </div>

            {/* SEO */}
            <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-4">
                    SEO Settings
                </h3>
                <div className="space-y-5">
                    <div>
                        <label htmlFor="meta-title" className="block text-sm font-medium text-foreground mb-1">
                            Meta Title
                        </label>
                        <Input
                            id="meta-title"
                            placeholder="60 characters max"
                            error={errors.metaTitle?.message}
                            {...register('metaTitle')}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">Recommended: 50–60 characters</p>
                    </div>
                    <div>
                        <label htmlFor="meta-desc" className="block text-sm font-medium text-foreground mb-1">
                            Meta Description
                        </label>
                        <Textarea
                            id="meta-desc"
                            placeholder="160 characters max"
                            rows={3}
                            {...register('metaDesc')}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">Recommended: 150–160 characters</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push('/admin/brands')}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || uploading}>
                    {isSubmitting
                        ? 'Saving…'
                        : isEditing
                            ? 'Update Brand'
                            : 'Create Brand'}
                </Button>
            </div>
        </form>
    );
}
