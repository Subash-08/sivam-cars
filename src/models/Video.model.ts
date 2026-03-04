/**
 * src/models/Video.model.ts — Mongoose model for the central video library.
 *
 * IMPORTANT: Only publicId is stored (not full URLs).
 * URLs are derived at runtime:
 *   Video : https://res.cloudinary.com/<cloud>/video/upload/<publicId>
 *   Poster: https://res.cloudinary.com/<cloud>/video/upload/so_2/<publicId>.jpg
 *
 * This avoids broken URLs and enables future CDN transformations.
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── Orientation enum ─────────────────────────────────────────────────────────

export const VIDEO_ORIENTATIONS = ['landscape', 'reels', 'youtube'] as const;
export type VideoOrientation = (typeof VIDEO_ORIENTATIONS)[number];

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IVideo extends Document {
    title: string;
    description?: string;
    publicId: string;       // Cloudinary public_id — the only stored reference
    thumbnailPublicId?: string; // Custom Thumbnail Cloudinary public_id
    orientation: VideoOrientation;
    duration?: number;      // seconds (optional — not always known at upload time)
    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const VideoSchema = new Schema<IVideo>(
    {
        title: {
            type: String,
            required: [true, 'Video title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        publicId: {
            type: String,
            required: [true, 'Cloudinary publicId is required'],
            trim: true,
        },
        thumbnailPublicId: {
            type: String,
            trim: true,
        },
        orientation: {
            type: String,
            enum: VIDEO_ORIENTATIONS,
            required: [true, 'Orientation is required'],
            default: 'landscape',
        },
        duration: {
            type: Number,
            min: [0, 'Duration must be non-negative'],
        },
    },
    { timestamps: true },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Admin library: sort by newest first (default)
VideoSchema.index({ createdAt: -1 });

// Enable text search in admin video picker
VideoSchema.index({ title: 'text' });

// ─── Named export ─────────────────────────────────────────────────────────────

export const Video: Model<IVideo> =
    (mongoose.models.Video as Model<IVideo>) ||
    mongoose.model<IVideo>('Video', VideoSchema);
