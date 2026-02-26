import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // ─── CSS Variable color tokens ───────────────────────────────
            // Uses RGB channels so opacity modifiers work: bg-primary/50
            colors: {
                background: 'rgb(var(--color-background) / <alpha-value>)',
                foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
                card: {
                    DEFAULT: 'rgb(var(--color-card) / <alpha-value>)',
                    hover: 'rgb(var(--color-card-hover) / <alpha-value>)',
                    foreground: 'rgb(var(--color-card-foreground) / <alpha-value>)',
                },
                popover: {
                    DEFAULT: 'rgb(var(--color-popover) / <alpha-value>)',
                    foreground: 'rgb(var(--color-popover-foreground) / <alpha-value>)',
                },
                primary: {
                    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
                    hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
                    foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
                    foreground: 'rgb(var(--color-secondary-foreground) / <alpha-value>)',
                },
                muted: {
                    DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
                    foreground: 'rgb(var(--color-muted-foreground) / <alpha-value>)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
                    foreground: 'rgb(var(--color-accent-foreground) / <alpha-value>)',
                },
                destructive: {
                    DEFAULT: 'rgb(var(--color-destructive) / <alpha-value>)',
                    foreground: 'rgb(var(--color-destructive-foreground) / <alpha-value>)',
                },
                success: 'rgb(var(--color-success) / <alpha-value>)',
                warning: 'rgb(var(--color-warning) / <alpha-value>)',
                border: 'rgb(var(--color-border) / <alpha-value>)',
                'border-strong': 'rgb(var(--color-border-strong) / <alpha-value>)',
                input: 'rgb(var(--color-input) / <alpha-value>)',
                ring: 'rgb(var(--color-ring) / <alpha-value>)',
            },

            // ─── Border radius (from CSS vars) ───────────────────────────
            borderRadius: {
                sm: 'var(--radius-sm)',
                DEFAULT: 'var(--radius)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
            },

            // ─── Typography ──────────────────────────────────────────────
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },

            // ─── Keyframes ───────────────────────────────────────────────
            keyframes: {
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in': {
                    from: { opacity: '0', transform: 'translateX(-12px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-in': 'slide-in 0.3s ease-out',
                shimmer: 'shimmer 1.5s infinite linear',
            },

            // ─── Background images ───────────────────────────────────────
            backgroundImage: {
                'grid-pattern':
                    'radial-gradient(rgb(var(--color-border) / 0.6) 1px, transparent 1px)',
            },
            backgroundSize: {
                'grid': '28px 28px',
            },
        },
    },
    plugins: [],
};

export default config;
