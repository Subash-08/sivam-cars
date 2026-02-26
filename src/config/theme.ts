/**
 * theme.ts — Central Theme Reference
 *
 * This file is the single source of truth for the design token names.
 * Components import TOKEN names from here — never raw values.
 *
 * To change the theme: update globals.css :root variables.
 * This file documents available tokens only.
 */

export const THEME = {
    colors: {
        // Surfaces
        background: 'bg-background',
        card: 'bg-card',
        cardHover: 'hover:bg-card-hover',
        muted: 'bg-muted',
        input: 'bg-input',
        popover: 'bg-popover',

        // Text
        foreground: 'text-foreground',
        cardForeground: 'text-card-foreground',
        mutedForeground: 'text-muted-foreground',
        accentForeground: 'text-accent-foreground',

        // Brand
        primary: 'bg-primary',
        primaryHover: 'hover:bg-primary-hover',
        primaryText: 'text-primary',
        primaryForeground: 'text-primary-foreground',

        // Secondary / Outline
        secondary: 'bg-secondary',
        secondaryForeground: 'text-secondary-foreground',

        // Accent (Silver)
        accent: 'text-accent',

        // Semantic
        destructive: 'bg-destructive',
        destructiveText: 'text-destructive',
        success: 'text-success',
        warning: 'text-warning',

        // Borders
        border: 'border-border',
        borderStrong: 'border-border-strong',
        ring: 'ring-ring',
    },
    radius: {
        sm: 'rounded-sm',
        base: 'rounded',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
    },
    animation: {
        fadeIn: 'animate-fade-in',
        slideIn: 'animate-slide-in',
    },
} as const;

export type ThemeColor = keyof typeof THEME.colors;
