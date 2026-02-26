import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
    primary:
        'bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg shadow-primary/20 border border-primary/0',
    secondary:
        'bg-secondary hover:bg-muted text-secondary-foreground border border-border-strong',
    ghost:
        'text-muted-foreground hover:text-foreground hover:bg-muted',
    outline:
        'border border-border-strong hover:border-primary/60 text-foreground hover:bg-muted',
    destructive:
        'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
};

const sizes: Record<ButtonSize, string> = {
    sm: 'h-8  px-3   text-xs  rounded-sm gap-1.5',
    md: 'h-10 px-5   text-sm  rounded    gap-2',
    lg: 'h-12 px-7   text-base rounded-lg gap-2.5',
    icon: 'h-10 w-10            rounded    ',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = 'primary', size = 'md', isLoading = false, disabled, className, children, ...props },
    ref,
) {
    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={twMerge(
                clsx(
                    'inline-flex items-center justify-center font-semibold',
                    'transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className,
                ),
            )}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
});

export default Button;
