'use client';

import { type ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCarSchema } from '@/validations/admin/car.schema';
import type { CreateCarInput } from '@/validations/admin/car.schema';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CarFormProviderProps {
    children: ReactNode;
    initialData?: Partial<CreateCarInput> & { _id?: string };
    isEditing?: boolean;
}

// ─── Default values ───────────────────────────────────────────────────────────

const DEFAULT_VALUES: CreateCarInput = {
    name: '',
    brand: '',
    price: 0,
    year: new Date().getFullYear(),
    kmsDriven: 0,
    fuelType: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Sedan',
    color: '',
    location: { city: '', state: '' },
    registration: '',
    numberOfOwners: undefined,
    insuranceDetails: '',
    images: [],
    sliderVideos: [],
    reelVideos: [],
    brochureUrl: '',
    features: [],
    specifications: [],
    keyInformation: [],
    statsPerformance: [],
    benefitsAddons: [],
    metaTitle: '',
    metaDesc: '',
    canonicalUrl: '',
    isFeatured: false,
    isSold: false,
    similarCars: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * CarFormProvider — wraps the entire multi-step form in a single
 * react-hook-form FormProvider. Every step reads/writes the same form state.
 *
 * NO dev watch logger (critique fix #1 — kills performance + console spam).
 */
export function CarFormProvider({ children, initialData }: CarFormProviderProps) {
    const methods = useForm<CreateCarInput>({
        resolver: zodResolver(createCarSchema),
        defaultValues: { ...DEFAULT_VALUES, ...initialData },
        mode: 'onTouched', // validate after first blur — no onChange spam
    });

    return (
        <FormProvider {...methods}>
            <div className="max-w-4xl mx-auto">
                {children}
            </div>
        </FormProvider>
    );
}
