import { z } from 'zod';

// ─── Reusable ObjectId schema ─────────────────────────────────────────────────

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid MongoDB ObjectId');

// ─── Layout types ─────────────────────────────────────────────────────────────

export const VIDEO_LAYOUT_TYPE_OPTIONS = [
    'single-highlight',
    'grid',
    'carousel',
    'reels',
    'spotlight',
] as const;

// ─── Ordered video entry ──────────────────────────────────────────────────────

const videoEntrySchema = z.object({
    videoId: objectIdSchema,
    order: z.number().int().min(0),
});

// ─── Create schema ────────────────────────────────────────────────────────────

export const createVideoSectionSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    subtitle: z.string().max(500).optional().or(z.literal('')),
    layoutType: z.enum(VIDEO_LAYOUT_TYPE_OPTIONS),
    order: z.number().int().min(0).max(1000).default(0),
    fullWidth: z.boolean().default(false),
    marginTop: z.number().int().min(0).max(200).default(0),
    marginBottom: z.number().int().min(0).max(200).default(0),
    isActive: z.boolean().default(true),
    videos: z.array(videoEntrySchema).max(20, 'Maximum 20 videos per section').default([]),
});

// ─── Update schema ────────────────────────────────────────────────────────────

export const updateVideoSectionSchema = createVideoSectionSchema.partial();

// ─── Reorder schema ───────────────────────────────────────────────────────────

export const reorderVideoSectionsSchema = z.object({
    orderedIds: z.array(objectIdSchema).min(1, 'At least one ID is required'),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type CreateVideoSectionInput = z.infer<typeof createVideoSectionSchema>;
export type UpdateVideoSectionInput = z.infer<typeof updateVideoSectionSchema>;
export type ReorderVideoSectionsInput = z.infer<typeof reorderVideoSectionsSchema>;
export type VideoEntryInput = z.infer<typeof videoEntrySchema>;
