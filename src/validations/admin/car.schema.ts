import { z } from 'zod';
import { FUEL_TYPES, TRANSMISSIONS, BODY_TYPES } from '@/types/filter.types';

// ─── Reusable sub-schemas ─────────────────────────────────────────────────────

/**
 * Key-value pairs: allow empty strings in schema — they are stripped
 * by stripEmptyPairs() before submit. If we require min(1) here, the
 * form rejects partial/blank rows the user hasn't filled yet.
 */
const keyValueSchema = z.object({
    key: z.string().max(100),
    value: z.string().max(500),
});

const imageSchema = z.object({
    url: z.string().url('Image URL must be valid'),
    publicId: z.string(),
    alt: z.string().max(200).optional(),
    isPrimary: z.boolean().default(false),
    order: z.number().int().min(0).default(0),
});

const videoSchema = z.object({
    url: z.string().url('Video URL must be valid'),
    publicId: z.string(),
    order: z.number().int().min(0).default(0),
});

/**
 * Helper: accept either a valid URL string or an empty string.
 * Zod `.optional()` only matches `undefined`, NOT `""`.
 * Form inputs produce `""` when cleared — this prevents ghost validation errors.
 */
const optionalUrl = z.string().url().or(z.literal('')).optional();

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid MongoDB ObjectId');

// ─── Main car schema ──────────────────────────────────────────────────────────

export const createCarSchema = z.object({
    // Core
    name: z.string().min(1).max(200),
    brand: objectIdSchema,

    // Pricing & specs
    price: z.number().min(0).max(100_000_000),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    kmsDriven: z.number().int().min(0).max(10_000_000),
    fuelType: z.enum(FUEL_TYPES as [string, ...string[]]),
    transmission: z.enum(TRANSMISSIONS as [string, ...string[]]),
    bodyType: z.enum(BODY_TYPES as [string, ...string[]]),
    color: z.string().max(50).optional(),

    // Ownership
    location: z.object({
        city: z.string().min(1).max(100),
        state: z.string().max(100).optional(),
    }),
    registration: z.string().max(20).optional(),
    numberOfOwners: z.number().int().min(1).max(10).optional(),
    insuranceDetails: z.string().max(500).optional(),

    // Media
    images: z.array(imageSchema).max(20).default([]),
    sliderVideos: z.array(videoSchema).max(5).default([]),
    reelVideos: z.array(videoSchema).max(5).default([]),
    brochureUrl: optionalUrl,

    // Dynamic sections (all optional — add incrementally via admin UI)
    features: z.array(keyValueSchema).default([]),
    specifications: z.array(keyValueSchema).default([]),
    keyInformation: z.array(keyValueSchema).default([]),
    statsPerformance: z.array(keyValueSchema).default([]),
    benefitsAddons: z.array(keyValueSchema).default([]),

    // SEO
    metaTitle: z.string().max(60).optional(),
    metaDesc: z.string().max(160).optional(),
    canonicalUrl: optionalUrl,

    // Flags
    isFeatured: z.boolean().default(false),
    isSold: z.boolean().default(false),
    similarCars: z.array(objectIdSchema).max(10).default([]),
});

export const updateCarSchema = createCarSchema.partial();

// ─── Inferred types ───────────────────────────────────────────────────────────

export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
