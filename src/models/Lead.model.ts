import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ILead extends Document {
    name: string;
    phone: string;
    message?: string;
    car: Types.ObjectId;
    source: string;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const LeadSchema = new Schema<ILead>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            trim: true,
            maxlength: [15, 'Phone cannot exceed 15 characters'],
        },
        message: {
            type: String,
            trim: true,
            maxlength: [500, 'Message cannot exceed 500 characters'],
        },
        car: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
            required: [true, 'Car reference is required'],
        },
        source: {
            type: String,
            default: 'detail-page',
            trim: true,
        },
    },
    { timestamps: true },
);

// Index for admin queries — newest leads first
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ car: 1, createdAt: -1 });

// ─── Named export ─────────────────────────────────────────────────────────────
export const Lead: Model<ILead> =
    (mongoose.models.Lead as Model<ILead>) ||
    mongoose.model<ILead>('Lead', LeadSchema);
