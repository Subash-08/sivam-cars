import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					hover: 'rgb(var(--color-card-hover) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: 'rgb(var(--color-success) / <alpha-value>)',
				warning: 'rgb(var(--color-warning) / <alpha-value>)',
				border: 'hsl(var(--border))',
				'border-strong': 'rgb(var(--color-border-strong) / <alpha-value>)',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				sm: 'calc(var(--radius) - 4px)',
				DEFAULT: 'var(--radius)',
				lg: 'var(--radius)',
				xl: 'var(--radius-xl)',
				md: 'calc(var(--radius) - 2px)'
			},
			fontFamily: {
				sans: [
					'var(--font-inter)',
					'system-ui',
					'sans-serif'
				]
			},
			keyframes: {
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(8px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					from: {
						opacity: '0',
						transform: 'translateX(-12px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				shimmer: {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'scroll-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-33.333%)' }
				},
				'scroll-left': {
					'0%': { transform: 'translateX(-33.333%)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				shimmer: 'shimmer 1.5s infinite linear',
				'scroll-right': 'scroll-right 20s linear infinite',
				'scroll-left': 'scroll-left 20s linear infinite'
			},
			backgroundImage: {
				'grid-pattern': 'radial-gradient(rgb(var(--color-border) / 0.6) 1px, transparent 1px)'
			},
			backgroundSize: {
				grid: '28px 28px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
