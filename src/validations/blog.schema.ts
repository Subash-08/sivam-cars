/**
 * src/validations/blog.schema.ts — Zod validation schemas for Blog data.
 */

import { z } from 'zod';
import { BlogStatus } from '@/types/blog.types';

export const BlogCreateSchema = z.object({
    title: z.string().min(3, 'Title is required').max(150, 'Title is too long'),
    slug: z.string().optional(), // Auto-generated if not provided
    html: z.string().min(10, 'Content is required'),
    excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
    meta_title: z.string().max(60, 'Meta title must be under 60 characters').optional(),
    meta_description: z.string().max(160, 'Meta description must be under 160 characters').optional(),
    og_title: z.string().max(60).optional(),
    og_description: z.string().max(160).optional(),
    canonical_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cluster: z.string().optional(),
    pillar_slug: z.string().optional(),
    image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
    image_alt: z.string().max(100).optional(),
    featured: z.boolean().default(false),
    noindex: z.boolean().default(false),
    status: z.nativeEnum(BlogStatus).default(BlogStatus.Draft),
    published_at: z.union([
        z.string().datetime().transform(str => new Date(str)),
        z.date()
    ]).optional(),
});

export const BlogUpdateSchema = BlogCreateSchema.partial();

export type BlogCreateInput = z.infer<typeof BlogCreateSchema>;
export type BlogUpdateInput = z.infer<typeof BlogUpdateSchema>;
