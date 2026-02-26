import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, rows = 4, ...props }, ref) => {
        return (
            <div className="w-full">
                <textarea
                    ref={ref}
                    rows={rows}
                    className={clsx(
                        'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground',
                        'placeholder:text-muted-foreground resize-y',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-colors duration-150',
                        error && 'border-destructive focus:ring-destructive/50',
                        className,
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
            </div>
        );
    },
);

Textarea.displayName = 'Textarea';
