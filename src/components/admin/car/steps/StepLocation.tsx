'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export function StepLocation() {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Location & Registration</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* City */}
                <div>
                    <label htmlFor="loc-city" className="block text-sm font-medium text-foreground mb-1">
                        City <span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="loc-city"
                        placeholder="e.g. Salem"
                        error={(errors.location as Record<string, { message?: string }>)?.city?.message}
                        {...register('location.city')}
                    />
                </div>

                {/* State */}
                <div>
                    <label htmlFor="loc-state" className="block text-sm font-medium text-foreground mb-1">State</label>
                    <Input id="loc-state" placeholder="e.g. Tamil Nadu" {...register('location.state')} />
                </div>

                {/* Registration */}
                <div>
                    <label htmlFor="car-reg" className="block text-sm font-medium text-foreground mb-1">Registration No.</label>
                    <Input id="car-reg" placeholder="TN-30-AB-1234" {...register('registration')} />
                </div>

                {/* No. of Owners */}
                <div>
                    <label htmlFor="car-owners" className="block text-sm font-medium text-foreground mb-1">Number of Owners</label>
                    <Input id="car-owners" type="number" min={1} max={10} placeholder="1" {...register('numberOfOwners', { valueAsNumber: true })} />
                </div>

                {/* Insurance */}
                <div className="sm:col-span-2">
                    <label htmlFor="car-insurance" className="block text-sm font-medium text-foreground mb-1">Insurance Details</label>
                    <Textarea id="car-insurance" placeholder="e.g. Comprehensive, valid till March 2026" rows={3} {...register('insuranceDetails')} />
                </div>
            </div>
        </div>
    );
}
