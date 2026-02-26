import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import type { FuelType, Transmission, BodyType } from '@/types/filter.types';
import { FUEL_TYPES, TRANSMISSIONS, BODY_TYPES } from '@/types/filter.types';

// ─── Sub-document interfaces ──────────────────────────────────────────────────

export interface ICarImage {
    url: string;
    publicId: string;
    alt?: string;
    isPrimary?: boolean;
    order?: number;
}

export interface ICarVideo {
    url: string;
    publicId: string;
    order: number;
}

export interface ICarLocation {
    city: string;
    state: string;
}

/** Generic key-value pair used for dynamic spec sections */
export interface IKeyValue {
    key: string;
    value: string;
}

// ─── Main interface ───────────────────────────────────────────────────────────

export interface ICar extends Document {
    // Core
    name: string;
    slug: string;
    brand: Types.ObjectId;

    // Pricing & specs
    price: number;
    year: number;
    kmsDriven: number;
    fuelType: FuelType;
    transmission: Transmission;
    bodyType: BodyType;
    color?: string;

    // Ownership
    numberOfOwners?: number;
    registration?: string;
    insuranceDetails?: string;

    // Content
    description?: string;
    features: IKeyValue[];           // [{ key: 'Sunroof', value: 'Yes' }]
    specifications: IKeyValue[];
    keyInformation: IKeyValue[];
    statsPerformance: IKeyValue[];
    benefitsAddons: IKeyValue[];

    // Media
    images: ICarImage[];
    sliderVideos: ICarVideo[];        // Videos shown with image gallery
    reelVideos: ICarVideo[];          // Short vertical reels
    brochureUrl?: string;            // Cloudinary PDF URL

    // Location
    location: ICarLocation;

    // Related
    similarCars: Types.ObjectId[];

    // State flags (soft delete)
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    isFeatured: boolean;
    isSold: boolean;

    // Analytics
    viewsCount: number;

    // SEO
    metaTitle?: string;
    metaDesc?: string;
    canonicalUrl?: string;

    // Audit
    createdBy?: string;
    updatedBy?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// ─── Key-value sub-schema ─────────────────────────────────────────────────────

const KeyValueSchema = new Schema<IKeyValue>(
    { key: { type: String, required: true }, value: { type: String, required: true } },
    { _id: false },
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const CarSchema = new Schema<ICar>(
    {
        // Core
        name: {
            type: String,
            required: [true, 'Car name is required'],
            trim: true,
            maxlength: [200, 'Name cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'Brand',
            required: [true, 'Brand is required'],
        },

        // Pricing & specs
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be non-negative'],
        },
        year: {
            type: Number,
            required: [true, 'Year is required'],
            min: [1900, 'Year must be 1900 or later'],
            max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
        },
        kmsDriven: {
            type: Number,
            required: [true, 'Kilometres driven is required'],
            min: [0, 'Kilometres driven must be non-negative'],
        },
        fuelType: { type: String, enum: FUEL_TYPES, required: true },
        transmission: { type: String, enum: TRANSMISSIONS, required: true },
        bodyType: { type: String, enum: BODY_TYPES, required: true },
        color: { type: String, trim: true },

        // Ownership
        numberOfOwners: { type: Number, min: 1 },
        registration: { type: String },
        insuranceDetails: { type: String },

        // Content
        description: { type: String },
        features: { type: [KeyValueSchema], default: [] },
        specifications: { type: [KeyValueSchema], default: [] },
        keyInformation: { type: [KeyValueSchema], default: [] },
        statsPerformance: { type: [KeyValueSchema], default: [] },
        benefitsAddons: { type: [KeyValueSchema], default: [] },

        // Media
        images: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
                alt: { type: String },
                isPrimary: { type: Boolean, default: false },
                order: { type: Number },
            },
        ],
        sliderVideos: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
                order: { type: Number, default: 0 },
                _id: false,
            },
        ],
        reelVideos: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
                order: { type: Number, default: 0 },
                _id: false,
            },
        ],
        brochureUrl: { type: String },

        // Location
        location: {
            city: { type: String, trim: true, required: true },
            state: { type: String, trim: true, required: true },
        },

        // Related
        similarCars: [{ type: Schema.Types.ObjectId, ref: 'Car' }],

        // State flags
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        isFeatured: { type: Boolean, default: false },
        isSold: { type: Boolean, default: false },

        // Analytics
        viewsCount: { type: Number, default: 0 },

        // SEO
        metaTitle: { type: String },
        metaDesc: { type: String },
        canonicalUrl: { type: String },

        // Audit
        createdBy: { type: String },
        updatedBy: { type: String },
    },
    { timestamps: true },
);

// ─── Indexes (minimal & additive — tuned for 30–10k inventory) ───────────────
//
// Strategy: isActive+isDeleted lead every compound index so the query planner
// always uses the index for the base filter. Separate per-field indexes let
// MongoDB pick the best one for any combination. A few critical compound
// indexes cover the most common multi-field query patterns.

// Base filter (every public query starts here)
CarSchema.index({ isActive: 1, isDeleted: 1 });

// Brand queries (most common — listing by brand page)
CarSchema.index({ isActive: 1, isDeleted: 1, brand: 1 });
CarSchema.index({ isActive: 1, isDeleted: 1, brand: 1, price: 1 });
CarSchema.index({ isActive: 1, isDeleted: 1, brand: 1, year: -1 });

// Fuel + transmission combo (second most common filter pairing)
CarSchema.index({ isActive: 1, isDeleted: 1, fuelType: 1, transmission: 1 });

// Price range standalone
CarSchema.index({ isActive: 1, isDeleted: 1, price: 1 });

// Year + price (budget + recency queries)
CarSchema.index({ isActive: 1, isDeleted: 1, year: -1, price: 1 });

// Featured cars (homepage widget)
CarSchema.index({ isActive: 1, isDeleted: 1, isFeatured: 1, createdAt: -1 });

// Location
CarSchema.index({ isActive: 1, isDeleted: 1, 'location.city': 1 });

// Default listing sort (newest first)
CarSchema.index({ isActive: 1, isDeleted: 1, createdAt: -1 });

// KMs driven sort
CarSchema.index({ isActive: 1, isDeleted: 1, kmsDriven: 1 });

// Slug lookup (SSR page generation — unique already covers this but explicit is faster)
CarSchema.index({ slug: 1 });

// Full-text search — covers name, description, feature values
// REQUIRED for $text queries in CarFilterService
CarSchema.index({ name: 'text', description: 'text', 'features.value': 'text' });

// ─── Named export ─────────────────────────────────────────────────────────────
export const Car: Model<ICar> =
    (mongoose.models.Car as Model<ICar>) ||
    mongoose.model<ICar>('Car', CarSchema);
