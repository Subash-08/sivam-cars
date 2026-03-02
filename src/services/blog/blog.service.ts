/**
 * src/services/blog/blog.service.ts — Encapsulates blog database operations.
 *
 * Provides safe abstraction over Mongoose `Blog` model.
 * Always returns simplified JS objects (`lean()`) for public queries, and robust documents for admin mutations.
 */

import { connectDB } from '@/lib/db';
import Blog from '@/models/Blog.model';
import { IBlog, BlogStatus, BlogFilterOptions } from '@/types/blog.types';
import { sanitizeHtml } from '@/lib/purify';
import { FilterQuery } from 'mongoose';

export class BlogService {
    /**
     * Normalizes Mongoose Lean documents to handle Capitalized keys from external webhooks
     * and safely serializes BSON objects (e.g. ObjectIds) for NextJS Client boundaries.
     */
    private static normalizeBlog(blog: any): any {
        if (!blog) return blog;
        const serialized = JSON.parse(JSON.stringify(blog));
        return {
            ...serialized,
            title: serialized.title || serialized.Title,
            slug: serialized.slug || serialized.Slug,
            html: serialized.html || serialized.Html,
            excerpt: serialized.excerpt || serialized.Excerpt,
            category: serialized.category || serialized.Category,
            tags: serialized.tags || serialized.Tags || [],
            status: serialized.status || serialized.Status || BlogStatus.Draft,
            views: serialized.views || serialized.Views || 0,
            image_url: serialized.image_url || serialized['Image URL'] || serialized.ImageUrl,
            image_alt: serialized.image_alt || serialized.ImageAlt,
            published_at: serialized.published_at || serialized.PublishedAt || serialized.created_at || serialized.CreatedAt || serialized.CreatedAt,
            created_at: serialized.created_at || serialized.CreatedAt,
            updated_at: serialized.updated_at || serialized.UpdatedAt,
            reading_time: serialized.reading_time || serialized.ReadingTime || 0,
            featured: serialized.featured || serialized.Featured || false,
        };
    }
    /**
     * Private helper to construct dynamic query fitlers from options
     */
    private static buildFilterQuery(options?: BlogFilterOptions) {
        const query: FilterQuery<IBlog> = {};

        if (options?.status) query.status = options.status;
        if (options?.category) query.category = options.category;
        if (options?.tag) query.tags = { $in: [options.tag] };
        if (options?.featured !== undefined) query.featured = options.featured;

        if (options?.search) {
            query.$or = [
                { title: { $regex: options.search, $options: 'i' } },
                { excerpt: { $regex: options.search, $options: 'i' } },
            ];
        }

        return query;
    }

    // ─────────────────────────────────────────────────────────────
    // PUBLIC QUERIES
    // ─────────────────────────────────────────────────────────────

    /**
     * Get paginated published blogs (For /blog page). Always uses .lean() for performance
     */
    static async getPublicBlogs(
        page = 1,
        limit = 10,
        options?: Omit<BlogFilterOptions, 'status'>
    ) {
        await connectDB();

        // Force published status for public queries
        const query = this.buildFilterQuery({ ...options, status: BlogStatus.Published });

        const skip = (page - 1) * limit;

        const [blogs, total] = await Promise.all([
            Blog.find(query)
                .sort({ published_at: -1, created_at: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            Blog.countDocuments(query),
        ]);

        return {
            blogs: blogs.map(this.normalizeBlog),
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + limit < total,
        };
    }

    /**
     * Get single published blog by slug
     */
    static async getBlogBySlug(slug: string) {
        await connectDB();
        const blog = await Blog.findOne({ slug, status: BlogStatus.Published }).lean().exec();
        return this.normalizeBlog(blog);
    }

    /**
     * Retrieves related posts by category (excluding the current one)
     */
    static async getRelatedBlogs(category: string | undefined, currentSlug: string, limit = 3) {
        if (!category) return [];
        await connectDB();

        const blogs = await Blog.find({
            category,
            slug: { $ne: currentSlug },
            status: BlogStatus.Published,
        })
            .sort({ published_at: -1 })
            .limit(limit)
            .lean()
            .exec();
        return blogs.map(this.normalizeBlog);
    }

    /**
     * Retrieves popular posts (by view count)
     */
    static async getPopularBlogs(limit = 4) {
        await connectDB();
        const blogs = await Blog.find({ status: BlogStatus.Published })
            .sort({ views: -1, published_at: -1 })
            .limit(limit)
            .lean()
            .exec();
        return blogs.map(this.normalizeBlog);
    }

    /**
     * Atomically increment the view count without triggering full document save validation hooks
     */
    static async incrementViews(slug: string) {
        await connectDB();
        return Blog.findOneAndUpdate(
            { slug, status: BlogStatus.Published },
            { $inc: { views: 1 } },
            { new: true }
        )
            .select('views')
            .lean()
            .exec();
    }

    // ─────────────────────────────────────────────────────────────
    // ADMIN QUERIES
    // ─────────────────────────────────────────────────────────────

    static async getAdminBlogs(page = 1, limit = 20, options?: BlogFilterOptions) {
        await connectDB();
        const query = this.buildFilterQuery(options);
        const skip = (page - 1) * limit;

        const [blogs, total] = await Promise.all([
            Blog.find(query)
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            Blog.countDocuments(query),
        ]);

        return {
            blogs: blogs.map(this.normalizeBlog),
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + limit < total,
        };
    }

    static async getBlogById(id: string) {
        await connectDB();
        const blog = await Blog.findById(id).lean().exec();
        return this.normalizeBlog(blog);
    }

    // ─────────────────────────────────────────────────────────────
    // MUTATIONS (Admin or n8n Automation)
    // ─────────────────────────────────────────────────────────────

    /**
     * Creates a new blog post.
     * Enforces DOMPurify HTML sanitization.
     */
    static async createBlog(data: Partial<IBlog>) {
        await connectDB();

        // Server-side HTML sanitization (CRITICAL for security)
        if (data.html) {
            data.html = sanitizeHtml(data.html);
        }

        const blog = new Blog(data);

        // Sets publishing date dynamically if status is directly Published
        if (blog.status === BlogStatus.Published && !blog.published_at) {
            blog.published_at = new Date();
        }

        await blog.save();
        return blog;
    }

    /**
     * Updates an existing blog post via ID.
     */
    static async updateBlog(id: string, updateData: Partial<IBlog>) {
        await connectDB();

        if (updateData.html) {
            updateData.html = sanitizeHtml(updateData.html);
        }

        const currentBlog = await Blog.findById(id);
        if (!currentBlog) throw new Error('Blog not found');

        // Capture publishing moment
        if (
            updateData.status === BlogStatus.Published &&
            currentBlog.status !== BlogStatus.Published &&
            !currentBlog.published_at &&
            !updateData.published_at
        ) {
            updateData.published_at = new Date();
        }

        return Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
    }

    /**
     * Deletes a blog via ID.
     */
    static async deleteBlogById(id: string) {
        await connectDB();
        return Blog.findByIdAndDelete(id).exec();
    }
}
