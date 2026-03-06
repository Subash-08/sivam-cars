import { z } from 'zod';

export const updateHeroSettingSchema = z.object({
    badgeText: z.string().min(1, 'Badge text is required').max(100),
    headingPrimary: z.string().min(1, 'Primary heading is required').max(100),
    headingSecondary: z.string().min(1, 'Secondary heading is required').max(100),
    description: z.string().min(1, 'Description is required').max(300),
    trustIndicators: z
        .array(z.string().min(1, 'Indicator cannot be empty').max(50, 'Must be 50 characters or less'))
        .max(10, 'Maximum of 10 trust indicators allowed'),
    backgroundImage: z.string().min(1, 'Background image is required'),
    backgroundImageAlt: z.string().min(1, 'Background image alt text is required').max(200),
});

export type UpdateHeroSettingInput = z.infer<typeof updateHeroSettingSchema>;
