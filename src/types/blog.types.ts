/**
 * src/types/blog.types.ts — TypeScript interfaces for the Blog domain.
 */

import { Document, Types } from 'mongoose';

export enum BlogStatus {
    Draft = 'Draft',
    Review = 'Review',
    Published = 'Published',
    Archived = 'Archived',
}

export interface IBlog {
    title: string;
    slug: string;
    html: string;
    excerpt: string;
    meta_title?: string;
    meta_description?: string;
    og_title?: string;
    og_description?: string;
    canonical_url?: string;
    category?: string;
    tags: string[];
    cluster?: string;
    pillar_slug?: string;
    image_url?: string;
    image_alt?: string;
    reading_time?: number;
    views: number;
    featured: boolean;
    noindex: boolean;
    status: BlogStatus;
    published_at?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IBlogDocument extends IBlog, Document {
    _id: Types.ObjectId;
}

export interface BlogListResponse {
    data: IBlog[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
}

export interface BlogFilterOptions {
    status?: BlogStatus;
    category?: string;
    tag?: string;
    featured?: boolean;
    search?: string;
}
