import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// ─── Lead Types ───────────────────────────────────────────────────────────────

export type LeadType = 'contact' | 'enquiry' | 'sell' | 'loan' | 'negotiation';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ILead extends Document {
    name: string;
    phone: string;
    email?: string;
    message?: string;
    car?: Types.ObjectId;
    type: LeadType;
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
        email: {
            type: String,
            trim: true,
            maxlength: [150, 'Email cannot exceed 150 characters'],
        },
        message: {
            type: String,
            trim: true,
            maxlength: [500, 'Message cannot exceed 500 characters'],
        },
        car: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
        },
        type: {
            type: String,
            enum: ['contact', 'enquiry', 'sell', 'loan', 'negotiation'],
            default: 'enquiry',
            trim: true,
        },
        source: {
            type: String,
            default: 'detail-page',
            trim: true,
        },
    },
    { timestamps: true },
);

// Indexes for admin queries
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ car: 1, createdAt: -1 });
LeadSchema.index({ type: 1, createdAt: -1 });

// ─── Named export ─────────────────────────────────────────────────────────────
export const Lead: Model<ILead> =
    (mongoose.models.Lead as Model<ILead>) ||
    mongoose.model<ILead>('Lead', LeadSchema);
