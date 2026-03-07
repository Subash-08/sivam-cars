import { z } from 'zod';

export const updateHeroSettingSchema = z.object({
    badgeText: z.string().max(100).optional().or(z.literal('')),
    headingPrimary: z.string().max(100).optional().or(z.literal('')),
    headingSecondary: z.string().max(100).optional().or(z.literal('')),
    description: z.string().max(300).optional().or(z.literal('')),
    trustIndicators: z
        .array(z.string().min(1, 'Indicator cannot be empty').max(50, 'Must be 50 characters or less'))
        .max(10, 'Maximum of 10 trust indicators allowed'),
    backgroundImage: z.string().min(1, 'Background image is required'),
    backgroundImageAlt: z.string().min(1, 'Background image alt text is required').max(200),
});

export type UpdateHeroSettingInput = z.infer<typeof updateHeroSettingSchema>;
