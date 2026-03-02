import { z } from 'zod';

export const sellCarSchema = z.object({
    brand: z.string().min(1, 'Brand is required').max(100),
    model: z.string().min(1, 'Model is required').max(100),
    year: z.string().min(1, 'Year is required'),
    kmDriven: z.string().min(1, 'Kilometers driven is required'),
    fuelType: z.string().min(1, 'Fuel type is required'),
    city: z.string().min(1, 'City is required').max(100),
    expectedPrice: z.string().min(1, 'Expected price is required'),
    name: z.string().min(1, 'Name is required').max(100),
    phone: z
        .string()
        .min(10, 'Enter a valid phone number')
        .max(15)
        .regex(/^[+\d][\d\s-]{8,14}$/, 'Enter a valid phone number'),
});

export type SellCarInput = z.infer<typeof sellCarSchema>;
