import { z } from 'zod';

export const loanLeadSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    phone: z
        .string()
        .min(10, 'Enter a valid phone number')
        .max(15, 'Phone number is too long')
        .regex(/^[+\d][\d\s-]{8,14}$/, 'Enter a valid phone number'),
    city: z
        .string()
        .min(1, 'City is required')
        .max(100, 'City name is too long'),
    monthlyIncome: z
        .string()
        .min(1, 'Monthly income is required')
        .max(20, 'Invalid income value'),
    carBudget: z
        .string()
        .min(1, 'Car budget is required')
        .max(20, 'Invalid budget value'),
    loanAmount: z
        .string()
        .min(1, 'Loan amount is required')
        .max(20, 'Invalid loan amount'),
});

export type LoanLeadInput = z.infer<typeof loanLeadSchema>;
