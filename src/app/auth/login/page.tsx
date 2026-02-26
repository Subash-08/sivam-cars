'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginInput } from '@/validations/auth.validation';
import { siteConfig } from '@/config/site';
import Button from '@/components/ui/Button';

export default function LoginPage() {
    const router = useRouter();
    const { status } = useSession();
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

    // Redirect to admin dashboard if already authenticated
    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/admin/dashboard');
        }
    }, [status, router]);

    // Show loading while checking session
    if (status === 'loading' || status === 'authenticated') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        {status === 'authenticated' ? 'Redirecting…' : 'Checking session…'}
                    </p>
                </div>
            </div>
        );
    }

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        setServerError(null);
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        setIsLoading(false);
        if (result?.error) {
            setServerError('Invalid email or password. Please try again.');
            return;
        }
        router.push('/admin/dashboard');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16 relative overflow-hidden">

            {/* Background grid */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none"
            />

            {/* Glow blobs */}
            <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />
            <div aria-hidden="true" className="absolute bottom-0 right-0 w-72 h-72 bg-primary/8 blur-3xl rounded-full pointer-events-none" />

            <div className="relative w-full max-w-md animate-fade-in">

                {/* Brand header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z" />
                            <circle cx="7.5" cy="17" r="1.5" />
                            <circle cx="16.5" cy="17" r="1.5" />
                            <path d="M5 9h14l-2-4H7L5 9z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">{siteConfig.name}</h1>
                    <p className="text-muted-foreground text-sm mt-1">Admin — Secure Portal</p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border rounded-xl p-8 shadow-2xl shadow-background/50">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Sign in to continue</h2>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-medium text-secondary-foreground">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...register('email')}
                                placeholder="admin@sivamcars.com"
                                className="w-full h-10 bg-input border border-border-strong hover:border-border-strong/80 focus:border-primary/60 focus:ring-1 focus:ring-ring rounded text-foreground placeholder:text-muted-foreground text-sm px-3.5 outline-none transition-all"
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                                    <span aria-hidden="true">⚠</span>{errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-sm font-medium text-secondary-foreground">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                {...register('password')}
                                placeholder="••••••••••"
                                className="w-full h-10 bg-input border border-border-strong hover:border-border-strong/80 focus:border-primary/60 focus:ring-1 focus:ring-ring rounded text-foreground placeholder:text-muted-foreground text-sm px-3.5 outline-none transition-all"
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                                    <span aria-hidden="true">⚠</span>{errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Server error */}
                        {serverError && (
                            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded px-4 py-3 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {serverError}
                            </div>
                        )}

                        {/* Submit */}
                        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2">
                            {!isLoading && 'Sign In'}
                        </Button>
                    </form>
                </div>

                {/* Divider line */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Secure access</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                {/* Footer trust signal */}
                <div className="flex items-center justify-center gap-5 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        SSL Secured
                    </span>
                    <span className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        Admin Only
                    </span>
                </div>

                <p className="text-center text-muted-foreground/50 text-xs mt-8">
                    &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                </p>
            </div>
        </div>
    );
}
