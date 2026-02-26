'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export function StepSEO() {
    const { register, control, watch } = useFormContext();

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">SEO & Flags</h2>

            {/* Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Featured toggle */}
                <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                        <label className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-card-hover cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={field.value ?? false}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="w-4 h-4 rounded accent-primary"
                            />
                            <div>
                                <span className="text-sm font-medium text-foreground">Featured</span>
                                <p className="text-xs text-muted-foreground">Show on homepage featured section</p>
                            </div>
                        </label>
                    )}
                />

                {/* Sold toggle (critique fix #6 — was missing from UI) */}
                <Controller
                    name="isSold"
                    control={control}
                    render={({ field }) => (
                        <label className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-card-hover cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={field.value ?? false}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="w-4 h-4 rounded accent-destructive"
                            />
                            <div>
                                <span className="text-sm font-medium text-foreground">Sold</span>
                                <p className="text-xs text-muted-foreground">Mark as sold — remains visible but tagged</p>
                            </div>
                        </label>
                    )}
                />
            </div>

            {/* SEO fields */}
            <div className="space-y-5 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">SEO Settings</h3>

                <div>
                    <label htmlFor="seo-title" className="block text-sm font-medium text-foreground mb-1">Meta Title</label>
                    <Input id="seo-title" placeholder="60 characters max" maxLength={60} {...register('metaTitle')} />
                    <p className="mt-1 text-xs text-muted-foreground">
                        {(watch('metaTitle') ?? '').length}/60 characters
                    </p>
                </div>

                <div>
                    <label htmlFor="seo-desc" className="block text-sm font-medium text-foreground mb-1">Meta Description</label>
                    <Textarea id="seo-desc" placeholder="160 characters max" rows={3} maxLength={160} {...register('metaDesc')} />
                    <p className="mt-1 text-xs text-muted-foreground">
                        {(watch('metaDesc') ?? '').length}/160 characters
                    </p>
                </div>

                <div>
                    <label htmlFor="seo-url" className="block text-sm font-medium text-foreground mb-1">Canonical URL</label>
                    <Input id="seo-url" placeholder="https://sivamcars.com/cars/..." {...register('canonicalUrl')} />
                </div>
            </div>
        </div>
    );
}
