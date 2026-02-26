import { z } from 'zod';

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const createBrandSchema = z.object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug mustbe lowercase with hyphens').optional(),
    logo: z.string().url('Logo must be a valid URL').optional(),
    description: z.string().max(1000).optional(),
    metaTitle: z.string().max(60).optional(),
    metaDesc: z.string().max(160).optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

// ─── Inferred types ───────────────────────────────────────────────────────────

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
