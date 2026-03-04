import { z } from 'zod';

// ─── Reusable ObjectId schema ─────────────────────────────────────────────────

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid MongoDB ObjectId');

// ─── Layout types ─────────────────────────────────────────────────────────────

export const LAYOUT_TYPE_OPTIONS = ['grid', 'carousel', 'horizontal-scroll'] as const;

// ─── Create schema ────────────────────────────────────────────────────────────

export const createHomeSectionSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    subtitle: z.string().max(500).optional().or(z.literal('')),
    layoutType: z.enum(LAYOUT_TYPE_OPTIONS),
    order: z.number().int().min(0).max(1000).default(0),
    viewAllText: z.string().max(100).optional().or(z.literal('')),
    viewAllLink: z.string().max(500).optional().or(z.literal('')),
    isActive: z.boolean().default(true),
    cars: z.array(objectIdSchema).max(50).default([]),
});

// ─── Update schema ────────────────────────────────────────────────────────────

export const updateHomeSectionSchema = createHomeSectionSchema.partial();

// ─── Reorder schema ───────────────────────────────────────────────────────────

export const reorderHomeSectionsSchema = z.object({
    orderedIds: z.array(objectIdSchema).min(1, 'At least one ID is required'),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type CreateHomeSectionInput = z.infer<typeof createHomeSectionSchema>;
export type UpdateHomeSectionInput = z.infer<typeof updateHomeSectionSchema>;
export type ReorderHomeSectionsInput = z.infer<typeof reorderHomeSectionsSchema>;
