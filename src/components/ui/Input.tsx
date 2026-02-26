import { type InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    ref={ref}
                    className={clsx(
                        'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground',
                        'placeholder:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-colors duration-150',
                        error && 'border-destructive focus:ring-destructive/50',
                        className,
                    )}
                    onWheel={props.type === 'number' ? (e) => (e.target as HTMLInputElement).blur() : undefined}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
            </div>
        );
    },
);

Input.displayName = 'Input';
