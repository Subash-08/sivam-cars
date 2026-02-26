import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBrand extends Document {
    name: string;
    slug: string;
    logo?: string;
    description?: string;
    metaTitle?: string;
    metaDesc?: string;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
    {
        name: {
            type: String,
            required: [true, 'Brand name is required'],
            unique: true,
            trim: true,
            maxlength: [100, 'Brand name cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
        },
        logo: { type: String },
        description: { type: String },
        metaTitle: { type: String },
        metaDesc: { type: String },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
    },
    { timestamps: true },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
// Compound: active brand lookup by slug (used in resolveBrands)
BrandSchema.index({ isActive: 1, isDeleted: 1, slug: 1 });

// ─── Named export (used by models/index.ts barrel) ────────────────────────────
export const Brand: Model<IBrand> =
    (mongoose.models.Brand as Model<IBrand>) ||
    mongoose.model<IBrand>('Brand', BrandSchema);
