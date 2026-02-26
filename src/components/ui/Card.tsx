import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
    { hover = false, glow = false, className, children, ...props },
    ref,
) {
    return (
        <div
            ref={ref}
            className={twMerge(
                clsx(
                    'bg-card text-card-foreground border border-border rounded-lg',
                    'transition-all duration-200',
                    hover && 'hover:bg-card-hover hover:border-border-strong cursor-pointer',
                    glow && 'hover:shadow-lg hover:shadow-primary/10',
                    className,
                ),
            )}
            {...props}
        >
            {children}
        </div>
    );
});

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    function CardHeader({ className, ...props }, ref) {
        return (
            <div
                ref={ref}
                className={twMerge('flex flex-col gap-1 p-6 pb-4', className)}
                {...props}
            />
        );
    },
);

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
    function CardTitle({ className, ...props }, ref) {
        return (
            <h3
                ref={ref}
                className={twMerge('text-base font-semibold text-foreground leading-tight', className)}
                {...props}
            />
        );
    },
);

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    function CardDescription({ className, ...props }, ref) {
        return (
            <p
                ref={ref}
                className={twMerge('text-sm text-muted-foreground', className)}
                {...props}
            />
        );
    },
);

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    function CardContent({ className, ...props }, ref) {
        return (
            <div ref={ref} className={twMerge('p-6 pt-0', className)} {...props} />
        );
    },
);

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    function CardFooter({ className, ...props }, ref) {
        return (
            <div
                ref={ref}
                className={twMerge('flex items-center justify-between p-6 pt-0', className)}
                {...props}
            />
        );
    },
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
