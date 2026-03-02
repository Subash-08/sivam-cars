import { z } from 'zod';

export const contactLeadSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    phone: z
        .string()
        .min(10, 'Enter a valid phone number')
        .max(15, 'Phone number is too long')
        .regex(/^[+\d][\d\s-]{8,14}$/, 'Enter a valid phone number'),
    email: z
        .string()
        .email('Enter a valid email address')
        .max(150, 'Email is too long')
        .optional()
        .or(z.literal('')),
    message: z
        .string()
        .min(1, 'Message is required')
        .max(500, 'Message cannot exceed 500 characters'),
});

export type ContactLeadInput = z.infer<typeof contactLeadSchema>;
