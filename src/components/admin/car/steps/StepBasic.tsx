'use client';

import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { FUEL_TYPES, TRANSMISSIONS, BODY_TYPES } from '@/types/filter.types';

interface Brand { _id: string; name: string; }

export function StepBasic() {
    const { register, formState: { errors }, control, watch } = useFormContext();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/admin/brands?limit=100');
                const data = await res.json();
                if (data.success) setBrands(data.brands ?? []);
            } catch { /* toast handled at page level */ }
            finally { setLoadingBrands(false); }
        })();
    }, []);

    const selectClass =
        'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground ' +
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors';

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Car Name */}
                <div className="sm:col-span-2">
                    <label htmlFor="car-name" className="block text-sm font-medium text-foreground mb-1">
                        Car Name <span className="text-destructive">*</span>
                    </label>
                    <Input id="car-name" placeholder="e.g. Fortuner 4x4" error={errors.name?.message as string} {...register('name')} />
                </div>

                {/* Brand */}
                <div>
                    <label htmlFor="car-brand" className="block text-sm font-medium text-foreground mb-1">
                        Brand <span className="text-destructive">*</span>
                    </label>
                    <Controller
                        name="brand"
                        control={control}
                        render={({ field }) => (
                            <select id="car-brand" {...field} className={selectClass} disabled={loadingBrands}>
                                <option value="">Select Brand</option>
                                {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                            </select>
                        )}
                    />
                    {errors.brand && <p className="mt-1 text-xs text-destructive">{errors.brand.message as string}</p>}
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="car-price" className="block text-sm font-medium text-foreground mb-1">
                        Price (₹) <span className="text-destructive">*</span>
                    </label>
                    <Input id="car-price" type="number" placeholder="500000" error={errors.price?.message as string} {...register('price', { valueAsNumber: true })} />
                </div>

                {/* Year */}
                <div>
                    <label htmlFor="car-year" className="block text-sm font-medium text-foreground mb-1">
                        Year <span className="text-destructive">*</span>
                    </label>
                    <Input id="car-year" type="number" placeholder="2023" error={errors.year?.message as string} {...register('year', { valueAsNumber: true })} />
                </div>

                {/* KMs */}
                <div>
                    <label htmlFor="car-kms" className="block text-sm font-medium text-foreground mb-1">
                        KMs Driven <span className="text-destructive">*</span>
                    </label>
                    <Input id="car-kms" type="number" placeholder="25000" error={errors.kmsDriven?.message as string} {...register('kmsDriven', { valueAsNumber: true })} />
                </div>

                {/* Fuel Type */}
                <div>
                    <label htmlFor="car-fuel" className="block text-sm font-medium text-foreground mb-1">Fuel Type</label>
                    <select id="car-fuel" {...register('fuelType')} className={selectClass}>
                        {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Transmission */}
                <div>
                    <label htmlFor="car-trans" className="block text-sm font-medium text-foreground mb-1">Transmission</label>
                    <select id="car-trans" {...register('transmission')} className={selectClass}>
                        {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Body Type */}
                <div>
                    <label htmlFor="car-body" className="block text-sm font-medium text-foreground mb-1">Body Type</label>
                    <select id="car-body" {...register('bodyType')} className={selectClass}>
                        {BODY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Color */}
                <div>
                    <label htmlFor="car-color" className="block text-sm font-medium text-foreground mb-1">Color</label>
                    <Input id="car-color" placeholder="e.g. Pearl White" {...register('color')} />
                </div>
            </div>

            {/* Live preview */}
            <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Preview</h3>
                <p className="text-sm text-foreground">
                    {watch('name') || 'Car Name'} — {watch('year') || 'Year'} — ₹{(watch('price') || 0).toLocaleString('en-IN')}
                </p>
            </div>
        </div>
    );
}
