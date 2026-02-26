'use client';

import { useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmLabel?: string;
    confirmVariant?: 'destructive' | 'primary';
    loading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmLabel = 'Confirm',
    confirmVariant = 'destructive',
    loading = false,
}: ConfirmDialogProps) {
    const cancelRef = useRef<HTMLButtonElement>(null);

    // Trap focus and handle Escape
    useEffect(() => {
        if (!isOpen) return;
        cancelRef.current?.focus();
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-card border border-border rounded-xl shadow-xl p-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-destructive" aria-hidden="true" />
                    </div>
                    <div>
                        <h2 id="confirm-title" className="text-base font-semibold text-foreground">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        ref={cancelRef}
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={confirmVariant}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Processing…' : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
