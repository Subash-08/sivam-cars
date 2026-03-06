/**
 * src/models/HeroSetting.model.ts — Singleton configuration for the homepage Hero section.
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHeroSetting extends Document {
    badgeText: string;
    headingPrimary: string;
    headingSecondary: string;
    description: string;
    trustIndicators: string[];
    backgroundImage: string;
    backgroundImageAlt: string;
    createdAt: Date;
    updatedAt: Date;
}

const HeroSettingSchema = new Schema<IHeroSetting>(
    {
        badgeText: {
            type: String,
            required: [true, 'Badge text is required'],
            trim: true,
            maxlength: [100, 'Badge text cannot exceed 100 characters'],
            default: 'Verified Used Cars Marketplace',
        },
        headingPrimary: {
            type: String,
            required: [true, 'Primary heading is required'],
            trim: true,
            maxlength: [100, 'Primary heading cannot exceed 100 characters'],
            default: 'Discover Quality',
        },
        headingSecondary: {
            type: String,
            required: [true, 'Secondary heading is required'],
            trim: true,
            maxlength: [100, 'Secondary heading cannot exceed 100 characters'],
            default: 'Used Cars at the Best Price',
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [300, 'Description cannot exceed 300 characters'],
            default: 'Browse thousands of inspected used cars.',
        },
        trustIndicators: {
            type: [String],
            default: [
                'Verified Listings',
                'Best Market Prices',
                'Easy Financing',
                'RC Transfer Support',
            ],
            validate: {
                validator: function (v: string[]) {
                    return v.every((str) => str.length <= 50);
                },
                message: 'Each trust indicator must be 50 characters or less',
            },
        },
        backgroundImage: {
            type: String,
            required: [true, 'Background image URL is required'],
            trim: true,
            default: '/assets/images/10003.jpg',
        },
        backgroundImageAlt: {
            type: String,
            required: [true, 'Background image alt text is required'],
            trim: true,
            maxlength: [200, 'Alt text cannot exceed 200 characters'],
            default: 'Premium used cars showroom',
        },
    },
    { timestamps: true }
);

// Mongoose model with a singleton pattern helper
export const HeroSetting: Model<IHeroSetting> =
    (mongoose.models.HeroSetting as Model<IHeroSetting>) ||
    mongoose.model<IHeroSetting>('HeroSetting', HeroSettingSchema);
