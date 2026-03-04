/**
 * src/models/HomeSection.model.ts — Mongoose Model for homepage showcase sections.
 *
 * Each document represents a configurable section on the public homepage.
 * Admin can create/edit/delete/reorder sections, attach cars, and pick layout.
 */

import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// ─── Layout type enum ─────────────────────────────────────────────────────────

export const LAYOUT_TYPES = ['grid', 'carousel', 'horizontal-scroll'] as const;
export type LayoutType = (typeof LAYOUT_TYPES)[number];

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IHomeSection extends Document {
    title: string;
    subtitle?: string;
    layoutType: LayoutType;
    order: number;
    viewAllText?: string;
    viewAllLink?: string;
    isActive: boolean;
    cars: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const HomeSectionSchema = new Schema<IHomeSection>(
    {
        title: {
            type: String,
            required: [true, 'Section title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        subtitle: {
            type: String,
            trim: true,
            maxlength: [500, 'Subtitle cannot exceed 500 characters'],
        },
        layoutType: {
            type: String,
            enum: LAYOUT_TYPES,
            required: [true, 'Layout type is required'],
            default: 'grid',
        },
        order: {
            type: Number,
            required: [true, 'Order is required'],
            default: 0,
            min: [0, 'Order must be non-negative'],
        },
        viewAllText: {
            type: String,
            trim: true,
            maxlength: [100, 'View All text cannot exceed 100 characters'],
        },
        viewAllLink: {
            type: String,
            trim: true,
            maxlength: [500, 'View All link cannot exceed 500 characters'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        cars: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Car',
            },
        ],
    },
    { timestamps: true },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Public query: active sections sorted by order
HomeSectionSchema.index({ isActive: 1, order: 1 });

// ─── Named export ─────────────────────────────────────────────────────────────

export const HomeSection: Model<IHomeSection> =
    (mongoose.models.HomeSection as Model<IHomeSection>) ||
    mongoose.model<IHomeSection>('HomeSection', HomeSectionSchema);
