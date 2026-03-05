/**
 * src/models/CustomerStory.model.ts — Mongoose Model for customer delivery stories.
 *
 * Each document represents a customer's delivery story card shown on the homepage.
 * Admin can create/edit/delete/reorder stories, upload Cloudinary images.
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ICustomerStory extends Document {
    customerName: string;
    location: string;
    testimonial: string;
    imageUrl: string;
    imagePublicId: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const CustomerStorySchema = new Schema<ICustomerStory>(
    {
        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
            maxlength: [100, 'Customer name cannot exceed 100 characters'],
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
            maxlength: [100, 'Location cannot exceed 100 characters'],
        },
        testimonial: {
            type: String,
            trim: true,
            maxlength: [200, 'Testimonial cannot exceed 200 characters'],
            default: '',
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true,
        },
        imagePublicId: {
            type: String,
            required: [true, 'Image public ID is required'],
            trim: true,
        },
        order: {
            type: Number,
            required: [true, 'Order is required'],
            default: 0,
            min: [0, 'Order must be non-negative'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Public query: active stories sorted by order
CustomerStorySchema.index({ isActive: 1, order: 1 });

// ─── Named export ─────────────────────────────────────────────────────────────

export const CustomerStory: Model<ICustomerStory> =
    (mongoose.models.CustomerStory as Model<ICustomerStory>) ||
    mongoose.model<ICustomerStory>('CustomerStory', CustomerStorySchema);
