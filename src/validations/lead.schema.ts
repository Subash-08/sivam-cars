import { z } from 'zod';

export const leadSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    phone: z
        .string()
        .min(10, 'Enter a valid phone number')
        .max(15)
        .regex(/^[+\d][\d\s-]{8,14}$/, 'Enter a valid phone number'),
    message: z.string().max(500).optional(),
    carId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid car reference'),
});

export type LeadInput = z.infer<typeof leadSchema>;
