import { z } from 'zod';

// ─── Create schema ────────────────────────────────────────────────────────────

export const createCustomerStorySchema = z.object({
    customerName: z.string().min(1, 'Customer name is required').max(100),
    location: z.string().min(1, 'Location is required').max(100),
    testimonial: z.string().max(200).optional().or(z.literal('')),
    imageUrl: z.string().url('Image URL must be a valid URL'),
    imagePublicId: z.string().min(1, 'Image public ID is required'),
    order: z.number().int().min(0).max(1000).default(0),
    isActive: z.boolean().default(true),
});

// ─── Update schema ────────────────────────────────────────────────────────────

export const updateCustomerStorySchema = createCustomerStorySchema.partial();

// ─── Reorder schema ───────────────────────────────────────────────────────────

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid MongoDB ObjectId');

export const reorderCustomerStoriesSchema = z.object({
    orderedIds: z.array(objectIdSchema).min(1, 'At least one ID is required'),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type CreateCustomerStoryInput = z.infer<typeof createCustomerStorySchema>;
export type UpdateCustomerStoryInput = z.infer<typeof updateCustomerStorySchema>;
export type ReorderCustomerStoriesInput = z.infer<typeof reorderCustomerStoriesSchema>;
