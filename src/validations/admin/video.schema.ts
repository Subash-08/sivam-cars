import { z } from 'zod';

// ─── Orientation options ──────────────────────────────────────────────────────

export const VIDEO_ORIENTATION_OPTIONS = ['landscape', 'reels', 'youtube'] as const;

// ─── Create schema ────────────────────────────────────────────────────────────

export const createVideoSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(1000).optional().or(z.literal('')),
    publicId: z.string().min(1, 'Cloudinary publicId is required').trim(),
    thumbnailPublicId: z.string().optional().or(z.literal('')),
    orientation: z.enum(VIDEO_ORIENTATION_OPTIONS).default('landscape'),
    duration: z.number().nonnegative().optional(),
});

// ─── Update schema ────────────────────────────────────────────────────────────

export const updateVideoSchema = createVideoSchema.partial();

// ─── Inferred types ───────────────────────────────────────────────────────────

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
