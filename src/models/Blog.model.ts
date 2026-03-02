/**
 * src/models/Blog.model.ts — Mongoose Model for Blog posts.
 */

import mongoose, { Schema, Model } from 'mongoose';
import { IBlogDocument, BlogStatus } from '@/types/blog.types';

const BlogSchema = new Schema<IBlogDocument>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, index: true },
        html: { type: String, required: true },
        excerpt: { type: String, maxlength: 500 },
        meta_title: { type: String },
        meta_description: { type: String },
        og_title: { type: String },
        og_description: { type: String },
        canonical_url: { type: String },
        category: { type: String, index: true },
        tags: [{ type: String, index: true }],
        cluster: { type: String },
        pillar_slug: { type: String },
        image_url: { type: String },
        image_alt: { type: String },
        reading_time: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        featured: { type: Boolean, default: false },
        noindex: { type: Boolean, default: false },
        status: {
            type: String,
            enum: Object.values(BlogStatus),
            default: BlogStatus.Draft,
            index: true,
        },
        published_at: { type: Date, index: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Pre-validate hook to automatically generate slug from title and estimate reading time
BlogSchema.pre('validate', function (next) {
    if (!this.slug && this.title) {
        // Convert to lowercase, remove special chars, replace spaces with hyphens
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Auto-calculate reading time if HTML exists
    if (this.html && !this.reading_time) {
        // Very basic word count estimation based on HTML content length
        const cleanText = this.html.replace(/<[^>]+>/g, ' ');
        const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;
        this.reading_time = Math.ceil(wordCount / 200); // 200 words per minute average
    }

    next();
});

// Avoid OverwriteModelError in Next.js HMR environment
const Blog: Model<IBlogDocument> = mongoose.models?.Blog || mongoose.model<IBlogDocument>('Blog', BlogSchema);

export default Blog;
