/**
 * src/models/VideoSection.model.ts — Mongoose model for homepage video showcase sections.
 *
 * Each document represents one configurable video section on the public homepage.
 * Admin can create, edit, reorder, and toggle sections.
 *
 * Videos are stored as an ordered subdocument array { video: ObjectId, order: number }
 * so admin-chosen display order is preserved at the DB level.
 */

import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// ─── Layout type enum ─────────────────────────────────────────────────────────

export const VIDEO_LAYOUT_TYPES = [
    'single-highlight', // Large primary player + thumbnail strip below
    'grid',             // Responsive grid: 1 → 2 → 3 cols
    'carousel',         // Horizontal snap-scroll slider
    'reels',            // Vertical 9:16 short-video layout
    'spotlight',        // Large video left + stacked smaller videos right (Tesla/Porsche style)
] as const;
export type VideoLayoutType = (typeof VIDEO_LAYOUT_TYPES)[number];

// ─── Ordered video entry ──────────────────────────────────────────────────────

export interface IVideoEntry {
    video: Types.ObjectId;
    order: number;
}

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IVideoSection extends Document {
    title: string;
    subtitle?: string;
    layoutType: VideoLayoutType;
    order: number;
    fullWidth: boolean;
    marginTop: number;
    marginBottom: number;
    isActive: boolean;
    videos: IVideoEntry[];
    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const VideoEntrySchema = new Schema<IVideoEntry>(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true,
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { _id: false }, // No separate _id for subdocuments
);

const VideoSectionSchema = new Schema<IVideoSection>(
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
            enum: VIDEO_LAYOUT_TYPES,
            required: [true, 'Layout type is required'],
            default: 'grid',
        },
        order: {
            type: Number,
            required: [true, 'Order is required'],
            default: 0,
            min: [0, 'Order must be non-negative'],
        },
        fullWidth: {
            type: Boolean,
            default: false,
        },
        marginTop: {
            type: Number,
            default: 0,
            min: [0, 'Margin must be non-negative'],
            max: [200, 'Margin cannot exceed 200px'],
        },
        marginBottom: {
            type: Number,
            default: 0,
            min: [0, 'Margin must be non-negative'],
            max: [200, 'Margin cannot exceed 200px'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        videos: {
            type: [VideoEntrySchema],
            default: [],
            validate: {
                validator: (v: IVideoEntry[]) => v.length <= 20,
                message: 'A section cannot contain more than 20 videos',
            },
        },
    },
    { timestamps: true },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Public query: active sections sorted by order
VideoSectionSchema.index({ isActive: 1, order: 1 });

// ─── Named export ─────────────────────────────────────────────────────────────

export const VideoSection: Model<IVideoSection> =
    (mongoose.models.VideoSection as Model<IVideoSection>) ||
    mongoose.model<IVideoSection>('VideoSection', VideoSectionSchema);
