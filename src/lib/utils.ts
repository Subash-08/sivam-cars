/**
 * src/lib/utils.ts — Shared utility functions.
 *
 * Architecture: pure functions only — no DB, no HTTP, no side effects.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with proper conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (conflict-free merging).
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Converts a string into a URL-safe slug.
 *
 * @example
 * slugify('Maruti Suzuki Swift 2022') → 'maruti-suzuki-swift-2022'
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multi-hyphen → single hyphen
        .replace(/^-+|-+$/g, ''); // Strip leading/trailing hyphens
}

/**
 * Formats a number as Indian currency (INR).
 *
 * @example
 * formatINR(1250000) → '₹12.50 L'
 */
export function formatINR(amount: number): string {
    if (amount >= 10_000_000) {
        return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
    }
    if (amount >= 100_000) {
        return `₹${(amount / 100_000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Formats kilometres with Indian number grouping.
 *
 * @example
 * formatKms(12500)  → '12,500 km'
 * formatKms(125000) → '1,25,000 km'
 */
export function formatKms(km: number): string {
    return `${new Intl.NumberFormat('en-IN').format(km)} km`;
}
